"""bash_gate 全量回歸：把語料裡的歷史指令重放過閘門，比對 golden 判斷。

  python .claude/harness/hooks/replay_corpus.py            # 比對，有差異即 exit 1
  python .claude/harness/hooks/replay_corpus.py --update    # 人工確認差異合理後重新蓋 golden

⚠ 只做文字判讀：指令字串當資料餵進 hook、讀回它印的 allow/ask/deny，全程不執行任何指令。

語料 bash_gate_corpus.jsonl 由新專案自己的 transcript 策展（模板不附語料——原專案語料含主機名與路徑）：
每行 {"cmd": ..., "worker": allow|ask|deny|none, "ceo": ...}；決策邊界（任一模式 ask/deny、worker 落 none）全留，
唯讀類抽樣數百條；憑證、email、主機名、IP 一律洗掉再入檔。
語料檔不存在時本支印提示後 exit 0（尚未建立回歸基線）。
改動 bash_gate.py 後跑這支，差異清單要逐條看過——特別是 ask→allow，那是放寬。
手寫的正反案例在 test_bash_gate.py，兩支都要綠。
"""
import collections
import contextlib
import importlib.util
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.join(HERE, "bash_gate_corpus.jsonl")
WORKSPACE = os.path.abspath(os.path.join(HERE, "..", "..", "..")).replace("\\", "/")

spec = importlib.util.spec_from_file_location("bash_gate", os.path.join(HERE, "bash_gate.py"))
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def decide(cmd, worker):
    if worker:
        os.environ["HARNESS_WORKER"] = "1"
    else:
        os.environ.pop("HARNESS_WORKER", None)
    buf = io.StringIO()
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(json.dumps(
        {"tool_name": "Bash", "cwd": WORKSPACE, "tool_input": {"command": cmd}}))
    try:
        with contextlib.redirect_stdout(buf):
            try:
                gate.main()
            except SystemExit:
                pass
            except Exception:
                pass
    finally:
        sys.stdin = old_stdin
    out = buf.getvalue().strip()
    if not out:
        return "none"
    try:
        return json.loads(out)["hookSpecificOutput"]["permissionDecision"]
    except Exception:
        return "none"


def main():
    update = "--update" in sys.argv
    if not os.path.exists(CORPUS):
        print("尚無語料檔 %s（新專案未建回歸基線），略過" % CORPUS)
        return 0
    rows = [json.loads(l) for l in io.open(CORPUS, encoding="utf-8") if l.strip()]
    diffs = []
    for r in rows:
        now_w, now_c = decide(r["cmd"], True), decide(r["cmd"], False)
        if now_w != r["worker"] or now_c != r["ceo"]:
            diffs.append((r, r["worker"], r["ceo"], now_w, now_c))  # 先留舊值，蓋 golden 前用
            r["worker"], r["ceo"] = now_w, now_c

    print("語料 %d 條，差異 %d 條" % (len(rows), len(diffs)))
    if diffs:
        kinds = collections.Counter()
        for r, old_w, old_c, w, c in diffs:
            for mode, was, now in (("worker", old_w, w), ("ceo", old_c, c)):
                if was != now:
                    kinds[(mode, "%s→%s" % (was, now))] += 1
        print("-- 變動類別（ask→allow 是放寬，必須逐條看）")
        for (mode, mv), n in kinds.most_common():
            print("   %-7s %-14s %d" % (mode, mv, n))
        loosened = [d for d in diffs if (d[1] == "ask" and d[3] != "ask") or (d[2] == "ask" and d[4] != "ask")]
        show = loosened or diffs
        print("-- %s 前 20 條" % ("放寬的" if loosened else "差異"))
        for r, old_w, old_c, w, c in show[:20]:
            print("   [worker %s→%s / ceo %s→%s] %s"
                  % (old_w, w, old_c, c, " ".join(r["cmd"].split())[:110]))

    if update:
        with io.open(CORPUS, "w", encoding="utf-8", newline="\n") as f:
            for r in rows:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print("golden 已更新")
        return 0
    return 1 if diffs else 0


if __name__ == "__main__":
    sys.exit(main())
