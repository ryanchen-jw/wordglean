#!/usr/bin/env python3
"""PreToolUse Bash 智能閘門（harness 通用版；複刻自前一專案的實戰版本）。

原則：**只有「碰到 prod 或對外」且「無法證明唯讀」時才問**。
本機指令不論解析成不成功一律不問——worker 本機全自動是既定政策，執行長模式的退路是分類器。
保守失敗（看不懂就問）只作用在 prod 範圍內，不再因為解析器看不懂本機片段而打擾人。

決策層級（一般 session）：
1. deny  — harness 永遠禁止項（--no-verify / force push / claude daemon stop）
2. ask   — 碰 prod／對外且非唯讀（ssh 內層寫指令、scp/rsync、psql 寫 SQL、git push、對外 curl 寫入）
           ＋不透明執行（eval / source / 腳本走 stdin 餵 shell）
3. allow — 唯讀與例行開發指令
4. 無輸出 — 落回原本權限流程（auto mode＝分類器）

Worker 模式（HARNESS_WORKER=1）：
1. deny  — 同上
2. ask   — 同上第 2 點（停 Needs input 等 attach，prod 寫入的最後防線）
3. allow — 其餘全部（本機一切操作含寫入）
⚠ 不可用「無輸出」代替 ask：worker 以 --permission-mode auto 起，無輸出＝分類器決定（曾因此讓 prod 寫入未經確認）

解析設計：自帶認得引號的 lexer，不用 shlex。理由是 shlex 的 punctuation_chars 不分引號內外，
會把 SQL 的 count(*)、awk 的 int($2/1024) 當成 shell 運算子，切出看不懂的片段再被誤判成 prod 寫入
（原專案全量重放：誤判的 ask 約有六分之一是這樣來的）。heredoc 內容在解析前剝掉、歸給它的出口。

任何例外一律 exit 0 不輸出。

作用範圍（可設定）：
- 環境變數 HARNESS_GATE_SCOPE＝以逗號分隔的路徑片段（不分大小寫、斜線方向不拘），
  session cwd 含任一片段才作用；
- 未設定時預設＝本檔所在 workspace 根目錄（hooks/ → harness/ → .claude/ → 根）。
"""
import json
import os
import re
import sys

SIMPLE_RO = {
    "ls", "cat", "head", "tail", "grep", "rg", "egrep", "fgrep", "wc", "pwd",
    "which", "whoami", "id", "uname", "date", "stat", "file", "du", "df", "ps",
    "free", "uptime", "hostname", "echo", "printf", "true", "false", "dirname",
    "basename", "realpath", "readlink", "md5sum", "sha1sum", "sha256sum",
    "sort", "uniq", "cut", "tr", "column", "jq", "diff", "comm", "tree",
    "env", "printenv", "type", "test", "[", "seq", "nproc", "sleep", "awk",
    "cd", "pushd", "popd", "pgrep", "journalctl", "dmesg", "last", "lsof",
    "nl", "tac", "rev", "base64", "getent", "ss", "netstat", "groups", "tty",
    "export", "set", "unset", "xxd", "od", "strings", "cmp", "paste", "join",
}
ALLOW_AS_IS = {"pytest", "ruff", "mypy"}
# shell 控制結構：切段後會單獨成段，本身不執行任何東西
CTRL_HEADER = {"for", "while", "until", "case", "select", "done", "fi", "esac",
               "elif", "break", "continue", "in", "esac"}
CTRL_PREFIX = {"do", "then", "else", "if", "{", "}", "!", "("}
GIT_RO_SUB = {
    "status", "log", "diff", "show", "ls-files", "rev-parse", "blame",
    "shortlog", "describe", "remote", "fetch", "grep", "reflog", "cat-file",
    "rev-list", "ls-tree", "show-ref", "for-each-ref", "count-objects", "var",
}
DOCKER_RO_SUB = {"ps", "logs", "inspect", "images", "version", "info", "stats",
                 "top", "port", "diff", "history", "events", "config"}
DOCKER_RO_SUB2 = {
    "system": {"df", "info", "events"},
    "image": {"inspect", "ls", "history"},
    "container": {"ls", "inspect", "logs", "top", "stats", "diff", "port"},
    "volume": {"ls", "inspect"},
    "network": {"ls", "inspect"},
    "compose": {"ps", "logs", "config", "images", "top", "version"},
}
AIRFLOW_RO = {
    "dags": {"list", "list-runs", "list-jobs", "list-import-errors", "state",
             "details", "report", "next-execution", "show", "show-dependencies"},
    "tasks": {"list", "state", "states-for-dag-run", "render"},
    "variables": {"list", "get"},
    "connections": {"list", "get"},
    "pools": {"list", "get"},
    "config": {"list", "get"},
    "providers": {"list"},
    "jobs": {"check"},
    "db": {"check"},
    "cheat-sheet": None,
    "info": None,
    "version": None,
}
CLAUDE_RO_SUB = {"agents", "logs"}
PY_RO_MODULE = {"pytest", "ruff", "mypy", "json.tool", "pip", "site", "sysconfig"}
PIP_RO_SUB = {"list", "show", "freeze", "check", "config", "debug"}
# 唯讀 SQL。psql 的 \d 系列 meta 指令一定要帶反斜線才算，否則 DELETE／DROP 會被 d[a-z]* 吃掉
SQL_RO = re.compile(
    r"^\s*(?:(?:select|show|explain|with|table|values)\b"
    r"|\\(?:d[a-z+]*|l[+]?|x|timing|pset|echo|conninfo|a|f|t|h|\?)\b)", re.I)
SAFE_REDIRECT = re.compile(r"^(/tmp/|/dev/null$|/dev/std)", re.I)
LOCAL_HOST = re.compile(r"^https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])([:/]|$)", re.I)
OPERATORS = {";", "&&", "||", "|", "&", "\n", "(", ")", ";;"}
REDIR_OUT = {">", ">>", ">|", ">&"}


def decide(decision, reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": reason,
    }, "suppressOutput": True}, ensure_ascii=True))
    sys.exit(0)


# --------------------------------------------------------------------------
# lexer：認得引號，因此 SQL/awk 裡的括號與分號不會被當成 shell 運算子
# --------------------------------------------------------------------------

def _read_heredocs(text):
    """剝掉 heredoc 內容，回傳 (剩餘文字, {tag: body})。tag 重複時後者覆蓋，夠用。"""
    bodies = {}
    out_lines = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        out_lines.append(line)
        tags = re.findall(r"<<-?\s*(['\"]?)([A-Za-z_][A-Za-z0-9_]*)\1", line)
        i += 1
        for _, tag in tags:
            body = []
            while i < len(lines) and lines[i].strip() != tag:
                body.append(lines[i])
                i += 1
            if i < len(lines):
                i += 1  # 吃掉結束標記那行
            bodies[tag] = "\n".join(body)
    return "\n".join(out_lines), bodies


def _lex(text):
    """把指令切成 token。引號內的一切都是字面值。回傳 (tokens, subs)。

    tokens: 字串列表，運算子與導向符號自成一個 token
    subs:   $(...) 與 `...` 的內文，呼叫端會當成獨立指令再解析一次
    """
    tokens, subs = [], []
    buf = []
    i, n = 0, len(text)
    depth = 0

    def flush():
        if buf:
            tokens.append("".join(buf))
            del buf[:]

    def read_paren(start):
        """start 指向 '('，回傳對應 ')' 的 index。"""
        d, j, q = 0, start, None
        while j < n:
            c = text[j]
            if q:
                if c == q:
                    q = None
                elif c == "\\" and q == '"':
                    j += 1
            elif c in "'\"":
                q = c
            elif c == "(":
                d += 1
            elif c == ")":
                d -= 1
                if d == 0:
                    return j
            j += 1
        return n - 1

    while i < n:
        ch = text[i]
        if ch == "'":
            j = text.find("'", i + 1)
            if j < 0:
                j = n
            buf.append(text[i + 1:j])
            i = j + 1
            continue
        if ch == '"':
            j, out = i + 1, []
            while j < n and text[j] != '"':
                if text[j] == "\\" and j + 1 < n and text[j + 1] in '"\\$`':
                    out.append(text[j + 1])
                    j += 2
                    continue
                if text[j] == "$" and j + 1 < n and text[j + 1] == "(":
                    k = read_paren(j + 1)
                    subs.append(text[j + 2:k])
                    j = k + 1
                    continue
                out.append(text[j])
                j += 1
            buf.append("".join(out))
            i = j + 1
            continue
        if ch == "\\" and i + 1 < n:
            buf.append(text[i + 1])
            i += 2
            continue
        if ch == "$" and i + 1 < n and text[i + 1] == "(":
            k = read_paren(i + 1)
            subs.append(text[i + 2:k])
            i = k + 1
            continue
        if ch == "`":
            j = text.find("`", i + 1)
            if j < 0:
                j = n
            subs.append(text[i + 1:j])
            i = j + 1
            continue
        if ch.isspace():
            flush()
            if ch == "\n":
                tokens.append("\n")
            i += 1
            continue
        # 運算子
        two = text[i:i + 2]
        if two in ("&&", "||", ";;", ">>", "<<", ">|", ">&", "<&"):
            if two == "<<":
                m = re.match(r"<<-?\s*(['\"]?)([A-Za-z_][A-Za-z0-9_]*)\1", text[i:])
                if m:
                    flush()
                    tokens.append("<<" + m.group(2))
                    i += m.end()
                    continue
            flush()
            tokens.append(two)
            i += 2
            continue
        if ch in ";|&":
            flush()
            tokens.append(ch)
            i += 1
            continue
        if ch in "<>":
            # 前面若是純數字（fd），併進運算子不要留下碎片
            if buf and re.fullmatch(r"\d", "".join(buf)):
                del buf[:]
            flush()
            tokens.append(ch)
            i += 1
            continue
        if ch == "(" and not buf:      # 只有在詞首才是分組，count(*) 的括號是字面值
            flush()
            tokens.append("(")
            depth += 1
            i += 1
            continue
        if ch == ")" and depth > 0 and not buf:
            flush()
            tokens.append(")")
            depth -= 1
            i += 1
            continue
        buf.append(ch)
        i += 1
    flush()
    return tokens, subs


def tokenize(cmd):
    """相容舊介面：只回 token 列表。"""
    return _lex(cmd)[0]


def split_segments(tokens):
    """依 shell 運算子切段；回傳 (各段 word list, 全部 redirect 目標)。"""
    segments, cur, redirects = [], [], []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t in OPERATORS:
            if cur:
                segments.append(cur)
                cur = []
        elif t in REDIR_OUT:
            if i + 1 < len(tokens):
                redirects.append(tokens[i + 1])
                i += 1
        elif t == "<":
            i += 1  # 輸入導向目標無害
        elif t.startswith("<<"):
            cur.append(t)  # heredoc 標記留著，之後用來取 body
        else:
            cur.append(t)
        i += 1
    if cur:
        segments.append(cur)
    return segments, redirects


def parse(cmd):
    """完整解析：回傳 (segments, redirects, heredoc bodies)。$() 內文也會成為 segment。"""
    stripped, bodies = _read_heredocs(cmd)
    tokens, subs = _lex(stripped)
    segments, redirects = split_segments(tokens)
    for s in subs:
        try:
            sub_segs, sub_red = split_segments(_lex(s)[0])
        except Exception:
            continue
        segments.extend(sub_segs)
        redirects.extend(sub_red)
    return segments, redirects, bodies


def strip_wrappers(words):
    """剝掉 env 賦值 / sudo / timeout N / 控制結構前綴。"""
    while words:
        w = words[0]
        if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*=.*", w):
            words = words[1:]
        elif w in ("sudo", "command", "nice", "nohup", "stdbuf", "time"):
            words = words[1:]
            if w == "sudo":
                while words and words[0].startswith("-"):
                    words = words[2:] if words[0] in ("-u", "-g") else words[1:]
        elif w == "timeout" and len(words) > 1:
            words = words[2:]
            while words and words[0].startswith("-"):
                words = words[1:]
        elif w in CTRL_PREFIX:
            words = words[1:]
        else:
            break
    return words


def base_name(w):
    return os.path.basename(w).lower()


def _heredoc_tag(words):
    for w in words:
        if w.startswith("<<"):
            return w[2:]
    return None


def _sql_readonly(sql):
    """整段 SQL 的每個語句都要是唯讀。"""
    if not sql.strip():
        return False
    for stmt in sql.split(";"):
        if stmt.strip() and not SQL_RO.match(stmt):
            return False
    return True


def is_readonly_segment(words, bodies=None):
    bodies = bodies or {}
    words = strip_wrappers(list(words))
    if not words:
        return True
    if all(re.fullmatch(r"\d+", w) or w.startswith("<<") for w in words):
        return True
    cmd = base_name(words[0])
    rest = [w for w in words[1:] if not w.startswith("<<")]
    tag = _heredoc_tag(words)

    if cmd in CTRL_HEADER:
        return True
    if cmd in ALLOW_AS_IS:
        return True
    if rest in (["--version"], ["-V"], ["--help"], ["-h"]):
        return True
    if cmd in ("bash", "sh", "zsh"):
        if "-c" in rest:
            i = rest.index("-c")
            if i + 1 < len(rest):
                try:
                    return all(is_readonly_segment(s, bodies)
                               for s in split_segments(_lex(rest[i + 1])[0])[0])
                except Exception:
                    return False
            return False
        if tag is not None:            # bash <<EOF … 內容當 shell 解析
            try:
                return all(is_readonly_segment(s, bodies)
                           for s in split_segments(_lex(bodies.get(tag, ""))[0])[0])
            except Exception:
                return False
        return False                   # bash -s / 互動 shell：看不到內容
    if cmd == "sed":
        return not any(w == "-i" or (w.startswith("-i") and len(w) <= 4) for w in rest)
    if cmd == "find":
        return not any(w in ("-delete", "-exec", "-execdir", "-ok", "-okdir",
                             "-fprintf", "-fprint") for w in rest)
    if cmd in SIMPLE_RO:
        return True
    if cmd == "git":
        r = list(rest)
        while r and (r[0].startswith("-") or (len(r) > 1 and r[0] in ("-C", "-c"))):
            r = r[2:] if r[0] in ("-C", "-c") else r[1:]
        if not r:
            return False
        sub = r[0]
        if sub in GIT_RO_SUB:
            return True
        if sub == "worktree":
            return len(r) > 1 and r[1] == "list"
        if sub == "stash":
            return len(r) > 1 and r[1] in ("list", "show")
        if sub == "branch":
            return all(w.startswith("-") for w in r[1:]) and not {"-D", "-d", "-m"} & set(r)
        if sub == "config":
            return any(w in ("--get", "--list", "-l", "--get-regexp") for w in r[1:])
        if sub == "tag":
            return all(w.startswith("-") for w in r[1:]) and "-d" not in r
        return False
    if cmd == "docker":
        r = list(rest)
        if r and r[0] == "compose":
            rr = r[1:]
            while rr and (rr[0].startswith("-") or (len(rr) > 1 and rr[0] in ("-f", "--file", "-p"))):
                rr = rr[2:] if rr[0] in ("-f", "--file", "-p") else rr[1:]
            return bool(rr) and rr[0] in DOCKER_RO_SUB2["compose"]
        if not r:
            return False
        if r[0] in DOCKER_RO_SUB:
            return True
        if r[0] in DOCKER_RO_SUB2:
            return len(r) > 1 and r[1] in DOCKER_RO_SUB2[r[0]]
        if r[0] == "exec":
            inner = r[1:]
            while inner and inner[0].startswith("-"):
                inner = inner[2:] if inner[0] in ("-u", "--user", "-w", "--workdir",
                                                  "-e", "--env") else inner[1:]
            inner = inner[1:]  # 跳過容器名
            if tag is not None and inner:
                inner = inner + ["<<" + tag]
            return is_readonly_segment(inner, bodies) if inner else False
        return False
    if cmd == "ssh":
        r = list(rest)
        while r and r[0].startswith("-"):
            r = r[2:] if r[0] in ("-i", "-p", "-o", "-l", "-F", "-J") else r[1:]
        remote = r[1:]
        if not remote:
            return False  # 互動 shell 不放行
        try:
            segs, _ = split_segments(_lex(" ".join(remote))[0])
        except Exception:
            return False
        if tag is not None and segs:
            segs[-1] = segs[-1] + ["<<" + tag]  # heredoc 餵進遠端的 stdin，歸給最後一個指令
        return all(is_readonly_segment(s, bodies) for s in segs)
    if cmd == "gcloud":
        if not (("ssh" in rest or "scp" in rest) and "compute" in rest):
            return False
        if "scp" in rest:
            return False
        payload = None
        for i, w in enumerate(rest):
            if w.startswith("--command="):
                payload = w.split("=", 1)[1]
            elif w == "--command" and i + 1 < len(rest):
                payload = rest[i + 1]
        if payload is None:
            return False  # 沒帶 --command＝開互動 shell
        try:
            return all(is_readonly_segment(s, bodies)
                       for s in split_segments(_lex(payload)[0])[0])
        except Exception:
            return False
    if cmd == "airflow":
        if not rest:
            return False
        sub = rest[0]
        if sub in AIRFLOW_RO:
            allowed = AIRFLOW_RO[sub]
            return True if allowed is None else (len(rest) > 1 and rest[1] in allowed)
        return False
    if cmd == "claude":
        return bool(rest) and rest[0] in CLAUDE_RO_SUB
    if cmd == "backlog":
        return not any(w in ("edit", "create", "archive", "complete", "init") for w in rest)
    if cmd == "psql":
        if any(w in ("-f", "--file") for w in rest):
            return False
        queries = []
        for i, w in enumerate(rest):
            if (w == "--command" or re.fullmatch(r"-[A-Za-z]*c", w)) and i + 1 < len(rest):
                queries.append(rest[i + 1])
        if tag is not None:
            queries.append(bodies.get(tag, ""))
        if queries:
            return all(_sql_readonly(q) for q in queries)
        return any(w in ("-l", "--list") for w in rest)
    if cmd in ("pip", "pip3"):
        return bool(rest) and rest[0] in PIP_RO_SUB
    if cmd == "fuser":
        return not any(w.startswith("-k") for w in rest)
    if cmd in ("curl", "wget"):   # 取資料算唯讀，帶 body/非 GET 才算寫入
        return not CURL_WRITE.search(" " + " ".join(rest))
    if cmd in ("python", "python3", "py"):
        if not rest:
            return False
        if rest[0] in ("-V", "--version"):
            return True
        if rest[0] == "-m" and len(rest) > 1:
            if rest[1] not in PY_RO_MODULE:
                return False
            if rest[1] == "pip":
                return len(rest) > 2 and rest[2] in PIP_RO_SUB
            return True
        return False
    return False


# --------------------------------------------------------------------------
# 決策：先判「碰不碰 prod／對外」，再判「能不能證明唯讀」
# --------------------------------------------------------------------------

REMOTE_CMDS = {"ssh", "scp", "rsync", "nc", "ncat", "telnet", "sftp"}
CURL_WRITE = re.compile(
    r"(^|\s)(-X\s*(?!GET\b)\w+|--request[= ]\s*(?!GET\b)\w+|-d\b|--data\b|--data-\S+"
    r"|-F\b|--form\b|-T\b|--upload-file\b|--post-data\b|--post-file\b|--method[= ]\s*(?!GET\b))")


def _external_url(rest):
    for w in rest:
        m = re.search(r"https?://\S+", w)
        if m and not LOCAL_HOST.match(m.group(0)):
            return True
    return False


def reaches_remote(words):
    """這一段是否會碰到 prod 或對外。只認明確標記，絕不由「看不懂」反推。"""
    words = strip_wrappers(list(words))
    if not words:
        return False
    cmd = base_name(words[0])
    rest = [w for w in words[1:] if not w.startswith("<<")]
    if cmd in REMOTE_CMDS:
        return True
    if cmd in ("curl", "wget"):
        return _external_url(rest)
    if cmd == "gcloud":
        return "ssh" in rest or "scp" in rest
    if cmd == "git":
        r = list(rest)
        while r and (r[0].startswith("-") or (len(r) > 1 and r[0] in ("-C", "-c"))):
            r = r[2:] if r[0] in ("-C", "-c") else r[1:]
        return bool(r) and r[0] == "push"
    if cmd == "psql":
        # 只有明確連到非本機主機才算碰 prod。prod 的 DB 一律經 ssh + docker exec 觸及，
        # 那條路徑由 ssh 分支把關；本機 dev/test 容器的寫入屬本機操作，不該打擾人。
        # 殘留風險：若有人先開 SSH tunnel 再打 localhost，這裡看不出來。
        for i, w in enumerate(rest):
            if w in ("-h", "--host") and i + 1 < len(rest):
                return not re.match(r"^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)$", rest[i + 1])
            if w.startswith("--host="):
                return not re.match(r"^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)$", w.split("=", 1)[1])
        return False
    return False


def is_opaque_exec(words, bodies=None):
    """執行看不到內容的東西：eval / source / 腳本走 stdin 餵 shell。"""
    bodies = bodies or {}
    words = strip_wrappers(list(words))
    if not words:
        return False
    cmd = base_name(words[0])
    if cmd in ("eval", "source"):
        return True
    if cmd == "." and len(words) > 1:
        return True
    return False


def nested_segments(words, bodies=None):
    """這一段內部還會被執行的指令：shell -c、shell heredoc、docker exec 內層。

    少了這層，`bash -c "scp …"`／`docker exec c bash -c "git push"` 會被當成純本機而放行
    （紅隊實證的藏匿手法）。"""
    bodies = bodies or {}
    out = []
    w = strip_wrappers(list(words))
    if not w:
        return out
    cmd = base_name(w[0])
    rest = [x for x in w[1:] if not x.startswith("<<")]
    tag = _heredoc_tag(w)
    try:
        if cmd in ("bash", "sh", "zsh"):
            if "-c" in rest:
                i = rest.index("-c")
                if i + 1 < len(rest):
                    out.extend(split_segments(_lex(rest[i + 1])[0])[0])
            elif tag is not None:
                out.extend(split_segments(_lex(bodies.get(tag, ""))[0])[0])
        elif cmd == "docker" and rest and rest[0] == "exec":
            inner = rest[1:]
            while inner and inner[0].startswith("-"):
                inner = inner[2:] if inner[0] in ("-u", "--user", "-w", "--workdir",
                                                  "-e", "--env") else inner[1:]
            inner = inner[1:]
            if inner:
                out.append(inner + (["<<" + tag] if tag else []))
    except Exception:
        return []
    return out


def is_prod_write_segment(words, bodies=None):
    """相容舊名：這一段是否需要人工確認。"""
    bodies = bodies or {}
    words = strip_wrappers(list(words))
    if not words:
        return False
    cmd = base_name(words[0])
    for sub in nested_segments(words, bodies):
        if is_prod_write_segment(list(sub), bodies):
            return True
    if cmd == "xargs":  # 包裝：判讀它實際執行的指令
        r = list(words[1:])
        while r and r[0].startswith("-"):
            r = r[2:] if r[0] in ("-I", "-n", "-P", "-L", "-d", "-a", "-E", "-s") else r[1:]
        return is_prod_write_segment(r, bodies) if r else False
    if is_opaque_exec(words, bodies):
        return True
    if not reaches_remote(words):
        return False          # 本機：不再追究解析得出解析不出
    if cmd in ("curl", "wget"):
        return bool(CURL_WRITE.search(" " + " ".join(words[1:])))
    if cmd in ("scp", "rsync", "nc", "ncat", "telnet", "sftp"):
        return True
    return not is_readonly_segment(words, bodies)


def _gate_scopes():
    """閘門作用範圍：HARNESS_GATE_SCOPE（逗號分隔路徑片段），未設定則用本檔所在 workspace 根。"""
    raw = os.environ.get("HARNESS_GATE_SCOPE", "").strip()
    if raw:
        scopes = [x.strip() for x in raw.split(",") if x.strip()]
    else:
        here = os.path.dirname(os.path.abspath(__file__))
        scopes = [os.path.abspath(os.path.join(here, "..", "..", ".."))]
    out = []
    for x in scopes:
        x = x.replace("\\", "/").lower().rstrip("/")
        # Git Bash 形式 /c/projects/x 與 Windows 形式 c:/projects/x 都可能出現在 cwd，兩種都收
        m = re.match(r"^([a-z]):/(.*)$", x)
        if m:
            out.append("/%s/%s" % (m.group(1), m.group(2)))
            out.append(m.group(2))
        out.append(x)
    return [x for x in out if x]


def main():
    data = json.load(sys.stdin)
    if data.get("tool_name") != "Bash":
        return
    cwd = (data.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd())
    cwd = cwd.replace("\\", "/").lower()
    if not any(scope in cwd for scope in _gate_scopes()):
        return
    cmd = (data.get("tool_input") or {}).get("command") or ""
    if not cmd.strip():
        return

    if re.search(r"\bgit\b[^|;&]*\s--no-verify\b", cmd):
        decide("deny", "跳 hook（--no-verify）為 harness 永遠禁止項")
    if re.search(r"\bgit\b[^|;&]*\bpush\b[^|;&]*(\s--force\b|\s-f\b)", cmd):
        decide("deny", "force push 為 harness 永遠禁止項")
    if re.search(r"\bclaude\s+daemon\s+stop\b", cmd):
        decide("deny", "claude daemon stop 會殺掉所有 background worker（harness 永遠禁止項）")

    segments, redirects, bodies = parse(cmd)
    if not segments:
        return

    needs_human = any(is_prod_write_segment(list(s), bodies) for s in segments)

    if os.environ.get("HARNESS_WORKER") == "1":
        if needs_human:
            decide("ask", "prod / 對外寫入或不透明執行需 attach 確認（bash_gate worker 模式）")
        decide("allow", "worker 本機/唯讀 prod 操作自動放行（bash_gate worker 模式）")

    if needs_human:
        decide("ask", "prod / 對外寫入或不透明執行需人工確認（bash_gate）")
    if redirects and not all(SAFE_REDIRECT.match(r.replace("\\", "/")) for r in redirects):
        return  # 重導向寫到 /tmp、/dev/null 以外 → 落回原本流程
    if all(is_readonly_segment(list(s), bodies) for s in segments):
        decide("allow", "唯讀/例行指令自動放行（bash_gate）")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass  # 解析失敗一律落回人工流程
    sys.exit(0)
