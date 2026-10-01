"""bash_gate.py 手寫正反案例（python .claude/harness/hooks/test_bash_gate.py）。

餵 PreToolUse JSON 進 hook、比對 permissionDecision。None＝無輸出（落分類器／原權限流程）。
這裡放對抗性與合成案例（歷史上沒發生過但必須守住的形態）；
歷史真實指令的全量回歸在 replay_corpus.py，改 bash_gate 後兩支都要綠。
"""
import json
import os
import subprocess
import sys

HOOK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bash_gate.py")
# 測試 cwd＝本檔所在 workspace 根底下的任一子目錄（bash_gate 預設作用範圍＝workspace 根）
CWD = os.path.join(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")), "subproject").replace("\\", "/")


def run(cmd, worker):
    env = dict(os.environ)
    env.pop("HARNESS_WORKER", None)
    env.pop("HARNESS_GATE_SCOPE", None)
    if worker:
        env["HARNESS_WORKER"] = "1"
    payload = json.dumps({"tool_name": "Bash", "cwd": CWD, "tool_input": {"command": cmd}})
    out = subprocess.run([sys.executable, HOOK], input=payload, capture_output=True, text=True, env=env).stdout.strip()
    return json.loads(out)["hookSpecificOutput"]["permissionDecision"] if out else None


CASES = [
    # (指令, worker 模式, 期望)
    ('timeout 300 ssh -T prod-host "sudo mkdir -p /opt/x && sudo docker cp /tmp/a.py c:/opt/a.py"', True, "ask"),   # 真實事故原句形態
    ('timeout 300 ssh -T prod-host "sudo mkdir -p /opt/x && sudo docker cp /tmp/a.py c:/opt/a.py"', False, "ask"),  # 執行長 session 同樣攔
    ('ssh prod-host "sudo docker ps && cat /etc/hostname"', True, "allow"),                                          # 唯讀 prod
    ('bash -c "git push origin main"', True, "ask"),                                                                 # 殼層包裝
    ("pytest tests/ -q", True, "allow"),                                                                             # 本機例行
    ("git push origin main", False, "ask"),                                                                          # 對外寫入
    ("ssh prod-host 'sudo -n docker inspect app_postgres --format \"{{.Config.Image}}\"'", False, "allow"),     # sudo 旗標
    ("ssh prod-host 'sudo docker exec app_postgres postgres --version'", False, "allow"),                       # 任意程式 --version
    ("timeout 60 ssh -o BatchMode=yes prod-host 'sudo -n docker ps' 2>/dev/null", False, "allow"),                  # 尾巴 2>/dev/null 的 fd 數字
    ("ssh prod-host 'sudo docker cp /tmp/a c:/b' 2>/dev/null", False, "ask"),                                       # 同形態但真寫入仍攔
    ("docker exec -w /tmp/x app_scheduler bash -c \"\npython - <<'PY'\nfrom src.common.db import session_scope\nwith session_scope() as s:\n    s.add_all([Post(text='VERIFY 用資料')])\nPY\necho '### list'; python scripts/cli.py list-items 2>&1 | head -4\n\"", True, "allow"),  # 本機 docker exec bash -c heredoc（曾被誤傷的形態）
    ("docker exec c bash -c \"scp /tmp/a prod-host:/opt/a\"", True, "ask"),                                         # 包裝內藏 prod 寫入仍攔
    ("bash -c 'psql -h db -c \"insert into t values (1)\"'", True, "ask"),                                            # 包裝內 psql 寫入
    ("bash -c 'psql -h db -c \"select 1\"'", True, "allow"),                                                          # 包裝內唯讀
    ("ssh prod-host 'sudo docker system df'", True, "allow"),                                                       # A：兩層唯讀子指令
    ("ssh prod-host 'sudo docker image inspect x --format \"{{.Id}}\"'", True, "allow"),                            # A：同上
    ("ssh prod-host 'sudo docker system prune -f'", True, "ask"),                                                   # A 反例：同前綴但是寫入
    ("ssh prod-host 'sudo docker image rm x'", True, "ask"),                                                        # A 反例
    ("docker exec c sh -c 'sleep 5; psql -U postgres -tAc \"select 1\"'", True, "allow"),                            # B：短旗標叢集
    # 本機容器的 DB 寫入屬本機操作（prod 的 DB 只經 ssh 觸及，由下面 ssh 那幾條把關）
    ("docker exec c sh -c 'psql -U postgres -tAc \"insert into t values (1)\"'", True, "allow"),
    ("ssh prod-host 'sudo docker exec c psql -U postgres -tAc \"insert into t values (1)\"'", True, "ask"),
    ("ssh prod-host 'sudo docker exec c python -c \"print(1)\"'", True, "ask"),                                     # C：維持 ask（prod 容器內任意程式碼）
    # 全量重放後的誤判修正，每條對應一個實際被擋過的形態
    ("git commit -m 'feat(eval): 重跑評測，改用 source 而非 xargs'", True, "allow"),                          # 文字裡的 eval/source/xargs 不該觸發
    ("grep -rl TODO . | xargs -r ls -t | head -3", True, "allow"),                                                   # xargs 包唯讀指令
    ("find . -name '*.log' | xargs -I{} scp {} prod-host:/opt/x/", True, "ask"),                                    # xargs 包 prod 寫入仍攔
    (". ./.env && echo $TOKEN", True, "ask"),                                                                        # 真正的 source 仍攔
    ("docker exec -i c psql -U postgres -c \"SELECT n.nspname||'.'||c.relname FROM pg_class c\"", True, "allow"),     # SQL 裡的句點不是 source
    ("ssh prod-host 'cd /opt/app && sudo docker ps'", True, "allow"),                                       # cd 不再讓整條變寫入
    ("ssh prod-host 'cd /opt/app && sudo rm -rf logs'", True, "ask"),                                       # cd 後面真寫入仍攔
    ("ssh prod-host 'for d in a b; do sudo docker ps; done'", True, "allow"),                                       # for/do/done 控制結構
    ("ssh prod-host 'for d in a b; do sudo rm -rf /opt/$d; done'", True, "ask"),                                    # 迴圈體是寫入仍攔
    ("ssh prod-host 'sudo docker exec c airflow dags list-runs -d daily_job'", True, "allow"),               # airflow 唯讀子指令
    ("ssh prod-host 'sudo docker exec c airflow dags delete daily_job'", True, "ask"),                       # airflow 寫入子指令
    ("ssh prod-host 'sudo docker exec app_postgres psql -U postgres -l'", True, "allow"),                       # psql -l 列資料庫
    ("ssh prod-host 'sudo journalctl -k -b -1 --no-pager | grep oom'", True, "allow"),                              # journalctl/pgrep 等查詢工具
    # 自帶 lexer＋先判 reach 再判唯讀。前四條是舊版看不到、真的溜過去的
    ("cd /tmp\ngit status --short\ngit push origin main", True, "ask"),                                              # 換行分隔的多行指令，舊版只看第一行
    ("S=/tmp/x.sh\ncat > $S <<'EOF'\necho hi\nEOF\nssh -T prod-host 'bash -s' < $S", True, "ask"),                   # 同上：腳本送進 prod 在第四行
    ("gcloud compute ssh prod-host --zone=my-zone --command=\"sudo rm -rf /opt/x\"", True, "ask"),              # gcloud 也是進 prod 的路
    ("gcloud compute ssh prod-host --zone=my-zone --command=\"sudo docker ps\"", True, "allow"),                # 同一條路的唯讀查詢
    ("ssh prod-host 'sudo docker exec c psql -U postgres -At -c \"DELETE FROM t WHERE x=1;\"'", True, "ask"),        # \\d 系列樣式不可誤吃 DELETE
    ("ssh prod-host 'sudo docker exec c psql -U postgres -At -c \"SELECT count(*) FROM t\"'", True, "allow"),        # 引號內的括號不是 shell 運算子
    ("ssh prod-host 'sudo docker exec c psql -U postgres' <<'SQL'\nSELECT 1;\nSQL", True, "allow"),                  # heredoc 餵進遠端 stdin 的 SQL
    ("ssh prod-host 'sudo docker exec c psql -U postgres' <<'SQL'\nDROP TABLE t;\nSQL", True, "ask"),                # 同上但是寫入
    ("cat > /tmp/note.md <<'EOF'\nssh prod-host 'sudo rm -rf /opt/x'\nEOF", True, "allow"),                          # heredoc 內容是資料不是指令
    ("ssh prod-host 'sudo docker exec c airflow dags list-runs -d x'", True, "allow"),                               # 內層 awk/SQL 括號不再切碎片段
    ("curl -sS https://api.example.com/api/v1/health", True, "allow"),                                              # 對外 GET 是取資料
    ("curl -sS -X POST https://api.example.com/api/v1/x -d '{}'", True, "ask"),                                     # 對外帶 body 才算寫入
]

if __name__ == "__main__":
    fails = 0
    for cmd, worker, want in CASES:
        got = run(cmd, worker)
        ok = got == want
        fails += not ok
        flat = " ".join(cmd.split())          # 多行指令壓成一行才不會把輸出撐爛
        print(f"{'PASS' if ok else 'FAIL'}  worker={int(worker)}  want={want!s:5}  got={got!s:5}  {flat[:70]}")
    sys.exit(1 if fails else 0)
