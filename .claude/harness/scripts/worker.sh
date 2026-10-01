#!/usr/bin/env bash
# Harness --bg worker 續派鏈工具 — Claude Code 原生 CLI 薄封裝。
# 只做三件事：把原生指令排對順序、填對參數、檢查靜默失敗；不自建任何平行實作。
# 用到的原生指令：claude --bg / --bg --resume / agents --all --json / logs / stop / rm；git worktree / branch / diff。
#
# 子指令：
#   worker.sh dispatch <Project> <name> <prompt檔> [TASK標籤] [--ro]   派工＋登記 registry（--ro = investigate-only 唯讀）
#   worker.sh resume   <完整sessionId> <指示> <新name> [TASK標籤]      續派 fork＋健檢＋登記；只 stop 舊 worker、不 rm
#   worker.sh close    <短ID> <Project> <topic|-> [TASK標籤]           結案清理：驗 diff 空 → worktree remove → branch -D → stop → rm（topic 給 - 表示無 worktree）
#   worker.sh wait     <短ID> [間隔秒=20]                              阻塞至 worker 離開 working，結束時印狀態＋logs 尾巴。
#                      ⚠ 輔助喚醒（綁 session：/model、compaction、長 session 都可能收掉它）
#                        主機制＝每回合開場 claude agents --json 對帳（daily-brain Step 5.1）；wait 只是順境加速
#   worker.sh redispatch <Project> <topic> <name> <handoff檔> [TASK標籤] worker 被 daemon 回收（logs 報 job not found、resume 健檢全敗）時，
#                      於既有 worktree 內開 fresh worker 續作。前提＝stage 快照鐵則（分支上的 commit 即真相）；
#                      handoff 檔需含已完成 stage 與 commit、剩餘工作、原驗收條件（transcript 已不可得，全靠 prompt 交接）
#
# 踩坑編碼（三坑）：
#   坑1 --resume 只認完整 UUID（短 ID 會靜默掉進 Resume 選單）→ resume 入口驗格式
#   坑2 claude rm 會刪 transcript、之後永遠無法 resume → resume 絕不 rm；rm 只在 close
#   坑3 worker 進 worktree 後 transcript 換 project 目錄 → 健檢失敗自動從 worktree 目錄重試
#
# 設定（環境變數）：
#   HARNESS_WS            workspace 根目錄（預設＝本檔往上三層：scripts/ → harness/ → .claude/ → 根）
#   HARNESS_WORKER_MODEL  worker 模型（預設 claude-opus-5-5[1m]）
#   派出的 worker 一律帶 HARNESS_WORKER=1（bash_gate worker 模式的開關）
set -uo pipefail

WS="${HARNESS_WS:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)}"
MODEL="${HARNESS_WORKER_MODEL:-claude-opus-5-5[1m]}"
REG="$WS/.claude/daily-plan/sessions/session-registry.md"
PY=python

reg_append() { # TASK Project shortId sessionId 事件
  printf '| %s | %s | %s | %s | %s | %s |\n' "$(date +%F)" "$1" "$2" "$3" "$4" "$5" >> "$REG"
}

# 依 name 取最新 background session 的 sessionId（原生 agents --all --json）
sid_by_name() {
  claude agents --all --json 2>/dev/null | $PY -c "
import json,sys
n=sys.argv[1]
d=[x for x in json.load(sys.stdin) if x.get('kind')=='background' and x.get('name')==n]
d.sort(key=lambda x: str(x.get('startedAt','')))
print(d[-1].get('sessionId','') if d else '')" "$1"
}

cwd_by_short() {
  claude agents --all --json 2>/dev/null | $PY -c "
import json,sys
s=sys.argv[1]
m=[x for x in json.load(sys.stdin) if x.get('id')==s]
print((m[0].get('cwd','') if m else '').replace(chr(92),'/'))" "$1"
}

# fork 健檢：先查 state（working/blocked/done＝活著），查不到才退回 logs 字串判讀
# （紅隊實證：純字串 grep 會把「訊息裡剛好含 resume session 字樣」的健康 fork 誤殺，rm 連 transcript 一起刪）
fork_healthy() { # shortId
  sleep 6
  local st
  st=$(claude agents --all --json 2>/dev/null | $PY -c "
import json,sys
s=sys.argv[1]
m=[x for x in json.load(sys.stdin) if x.get('id')==s]
print(m[0].get('state','') if m else '')" "$1" 2>/dev/null)
  case "$st" in working|blocked|done) return 0 ;; esac
  ! claude logs "$1" 2>/dev/null | tail -40 | grep -qiE "resume session|select a session|no sessions found"
}

cmd_dispatch() {
  local proj="${1:-}" name="${2:-}" pfile="${3:-}" task="${4:-${2:-}}" ro="${5:-}"
  [ -n "$proj" ] && [ -n "$name" ] && [ -n "$pfile" ] || {
    echo "用法: worker.sh dispatch <Project> <name> <prompt檔> [TASK標籤] [--ro]" >&2; return 1; }
  local tools="Read,Glob,Grep,Edit,Write"
  [ "$ro" = "--ro" ] || [ "$task" = "--ro" ] && { tools="Read,Glob,Grep"; [ "$task" = "--ro" ] && task="$name"; }
  [ -f "$pfile" ] || { echo "ERROR: prompt 檔不存在：$pfile" >&2; return 1; }
  # 先轉絕對路徑再 cd——相對路徑會在 cd 後 cat 失敗、worker 以空 prompt 啟動（idle）（曾致多個 worker 空轉）
  pfile="$(cd "$(dirname "$pfile")" && pwd)/$(basename "$pfile")"
  cd "$WS/$proj" || return 1
  HARNESS_WORKER=1 claude --bg "$(cat "$pfile")" --name "$name" --model "$MODEL" --permission-mode auto --allowedTools "$tools" || return 1
  local sid; sid=$(sid_by_name "$name")
  [ -n "$sid" ] || { echo "ERROR: agents --all --json 找不到 name=$name，registry 未登記" >&2; return 1; }
  local short="${sid:0:8}"
  fork_healthy "$short" || echo "WARN: $short 健檢可疑（logs 尾巴像 Resume 選單），請 claude logs $short 目檢" >&2
  reg_append "$task" "$proj" "$short" "$sid" "派工（worker.sh）"
  echo "OK shortId=$short sessionId=$sid"
  echo "→ 輔助：可掛「worker.sh wait $short」（run_in_background）加速喚醒；主機制＝每回合開場 claude agents --json 對帳"
}

cmd_resume() {
  local sid="${1:-}" msg="${2:-}" newname="${3:-}" task="${4:-${3:-}}"
  [ -n "$sid" ] && [ -n "$msg" ] && [ -n "$newname" ] || {
    echo "用法: worker.sh resume <完整sessionId> <指示> <新name> [TASK標籤]" >&2; return 1; }
  [[ "$sid" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]] || {
    echo "ERROR: --resume 只認完整 sessionId（UUID）；短 ID 會靜默掉進 Resume 選單（坑 1）" >&2; return 1; }
  local oldshort="${sid:0:8}"
  local basedir; basedir=$(cwd_by_short "$oldshort"); [ -n "$basedir" ] || basedir="$WS"

  # 候選執行目錄：登記的 cwd → 該 repo 的各 worktree（坑 3：transcript 可能跟著 worker 搬進 worktree 對應目錄）
  local dirs=("$basedir")
  while IFS= read -r wt; do dirs+=("$wt"); done < <(git -C "$basedir" worktree list --porcelain 2>/dev/null | sed -n 's/^worktree //p' | tail -n +2)

  for dir in "${dirs[@]}"; do
    cd "$dir" 2>/dev/null || continue
    # ⚠ resume 絕不加 --model：--bg --resume 併 --model 會讓 session 憑空暴斃（state=failed、logs 報 job not found，
    #   曾兩次實證）。fork 沿用原 session 建立時的模型，dispatch 已鎖 $MODEL，此處毋須也不可覆寫。
    HARNESS_WORKER=1 claude --bg --resume "$sid" --name "$newname" "$msg" >/dev/null 2>&1 || continue
    local newsid; newsid=$(sid_by_name "$newname")
    [ -n "$newsid" ] || continue
    local newshort="${newsid:0:8}"
    if fork_healthy "$newshort"; then
      claude stop "$oldshort" >/dev/null 2>&1   # 坑 2：只 stop、絕不 rm（rm 會刪 transcript）
      reg_append "$task" "$(basename "$basedir")" "$newshort" "$newsid" "續派成功（fork 自 $sid、於 $dir）"
      echo "OK shortId=$newshort sessionId=$newsid dir=$dir"
      echo "→ 輔助：可掛「worker.sh wait $newshort」（run_in_background）加速喚醒；主機制＝每回合開場 claude agents --json 對帳"
      return 0
    fi
    echo "WARN: 於 $dir fork 掉進 Resume 選單，清除後換目錄重試" >&2
    claude stop "$newshort" >/dev/null 2>&1; claude rm "$newshort" >/dev/null 2>&1
  done
  reg_append "$task" "$(basename "$basedir")" "$oldshort" "$sid" "❌ 續派失敗（所有候選目錄健檢皆未過）"
  echo "ERROR: 續派失敗——transcript 已被 rm（坑 2）、worker 已被 daemon 回收、或目錄判斷不足；worktree 分支還在 → 改用 worker.sh redispatch 續作" >&2
  return 1
}

# 回收復原：worker 被 daemon 收走（間歇、不可預期）但 worktree 分支還在時，於 worktree 內開 fresh worker 續作。
# 不嘗試搶救原 session（logs/resume 已不可得）；接續狀態全靠 handoff prompt＋分支上的 stage 快照 commit。
cmd_redispatch() {
  local proj="${1:-}" topic="${2:-}" name="${3:-}" pfile="${4:-}" task="${5:-${3:-}}"
  [ -n "$proj" ] && [ -n "$topic" ] && [ -n "$name" ] && [ -n "$pfile" ] || {
    echo "用法: worker.sh redispatch <Project> <topic> <name> <handoff檔> [TASK標籤]" >&2; return 1; }
  [ -f "$pfile" ] || { echo "ERROR: handoff 檔不存在：$pfile" >&2; return 1; }
  local wt="$WS/$proj/.claude/worktrees/$topic"
  [ -d "$wt" ] || { echo "ERROR: worktree 不存在：$wt（無既有分支可續，改用 dispatch 全新派工）" >&2; return 1; }
  # 防呆（紅隊實證）：stale 目錄（worktree 已除名、目錄殘留）的 git 會解析回主 repo——在此開 worker 會把 commit 直接打進主線
  local tl; tl=$(git -C "$wt" rev-parse --show-toplevel 2>/dev/null)
  [ "$(printf %s "$tl" | tr 'A-Z' 'a-z')" = "$(printf %s "$wt" | tr 'A-Z' 'a-z')" ] || {
    echo "ERROR: $wt 不是註冊的 worktree（git toplevel=$tl）——stale 目錄，先 git worktree repair 或人工重建再來" >&2; return 1; }
  local cur; cur=$(git -C "$wt" rev-parse --abbrev-ref HEAD 2>/dev/null)
  [ "$cur" = "worktree-$topic" ] || {
    echo "ERROR: worktree 目前分支是 $cur、非 worktree-$topic——不符預期，人工確認後再派" >&2; return 1; }
  cd "$wt" || return 1
  HARNESS_WORKER=1 claude --bg "$(cat "$pfile")" --name "$name" --model "$MODEL" --permission-mode auto --allowedTools "Read,Glob,Grep,Edit,Write" || return 1
  local sid; sid=$(sid_by_name "$name")
  [ -n "$sid" ] || { echo "ERROR: agents --all --json 找不到 name=$name，registry 未登記" >&2; return 1; }
  local short="${sid:0:8}"
  fork_healthy "$short" || echo "WARN: $short 健檢可疑（logs 尾巴像 Resume 選單），請 claude logs $short 目檢" >&2
  reg_append "$task" "$proj" "$short" "$sid" "回收復原重派（於 worktree-$topic 續作）"
  echo "OK shortId=$short sessionId=$sid dir=$wt"
  echo "→ 輔助：可掛「worker.sh wait $short」（run_in_background）加速喚醒；主機制＝每回合開場 claude agents --json 對帳"
}

cmd_close() {
  local short="${1:-}" proj="${2:-}" topic="${3:-}" task="${4:-${2:-}}"
  [ -n "$short" ] && [ -n "$proj" ] && [ -n "$topic" ] || {
    echo "用法: worker.sh close <短ID> <Project> <topic|-> [TASK標籤]" >&2; return 1; }
  local repo="$WS/$proj"
  claude stop "$short" >/dev/null 2>&1   # 先停 session：釋放 worktree lock（活著的 worker 持鎖、remove 必敗）
  if [ "$topic" != "-" ]; then
    local br="worktree-$topic" wt="$repo/.claude/worktrees/$topic"
    # 防呆（紅隊實證）：分支不存在時舊版 diff 報錯→stdout 空→誤判「已 merge」放行，
    # 而 stale 目錄的 git 解析回主 repo，clean/remove 會誤傷主 repo 與 sibling worktree
    git -C "$repo" rev-parse --verify -q "$br" >/dev/null 2>&1 || {
      echo "ERROR: 分支 $br 不存在——疑似 stale 目錄，拒絕清理（worker 已 stop）；目錄請人工確認後自行處置" >&2; return 1; }
    if [ -d "$wt" ]; then
      local tl; tl=$(git -C "$wt" rev-parse --show-toplevel 2>/dev/null)
      [ "$(printf %s "$tl" | tr 'A-Z' 'a-z')" = "$(printf %s "$wt" | tr 'A-Z' 'a-z')" ] || {
        echo "ERROR: $wt 不是註冊的 worktree（git toplevel=$tl）——clean/remove 會誤傷主 repo，拒絕清理、請人工處置" >&2; return 1; }
    fi
    local mainbr; mainbr=$(git -C "$repo" rev-parse --abbrev-ref HEAD)
    # 「內容已進主線」判定限定「分支自己動過的路徑」——二點全量 diff 會把主線上其他任務的 commit 算進來，
    # 導致已正確 squash 的 worktree 永遠關不掉（紅隊實證，stale 目錄堆積的成因）
    local mb; mb=$(git -C "$repo" merge-base "$mainbr" "$br" 2>/dev/null)
    [ -n "$mb" ] || { echo "ERROR: 找不到 $mainbr 與 $br 的 merge-base，不清理" >&2; return 1; }
    local d; d=$(git -C "$repo" diff --name-only -z "$mb" "$br" 2>/dev/null | xargs -0 -r git -C "$repo" diff --stat "$mainbr" "$br" -- 2>/dev/null)
    [ -z "$d" ] || { echo "ERROR: $br 的改動尚未全數進 $mainbr（限分支自身路徑比對）——未 squash-merge？不清理（worker 已 stop、可 resume）" >&2; return 1; }
    # 解鎖（Claude 建 worktree 時上的 lock，session 停止也不會自動解）；清 gitignored 垃圾（__pycache__ 等，-X 不碰真產出）；不用 --force：dirty 時 git 拒絕、保護未收割產出
    [ -d "$wt" ] && git -C "$repo" worktree unlock "$wt" 2>/dev/null
    [ -d "$wt" ] && git -C "$wt" clean -qfdX 2>/dev/null
    [ -d "$wt" ] && { git -C "$repo" worktree remove "$wt" || { echo "ERROR: worktree 內有未 commit 產出？先收割或確認可棄再手動 remove --force" >&2; return 1; }; }
    git -C "$repo" branch -D "$br" >/dev/null 2>&1
  fi
  claude rm "$short"   >/dev/null 2>&1   # 最後一步才 rm（此後永遠無法 resume）
  reg_append "$task" "$proj" "$short" "-" "結案清理（worker.sh close）"
  echo "OK closed $short"
}

cmd_wait() {
  local short="${1:-}" iv="${2:-20}"
  [ -n "$short" ] || { echo "用法: worker.sh wait <短ID> [間隔秒]" >&2; return 1; }
  local st
  while :; do
    st=$(claude agents --json 2>/dev/null | $PY -c "
import json,sys
s=sys.argv[1]
m=[x for x in json.load(sys.stdin) if x.get('id')==s]
print(m[0].get('state','gone') if m else 'gone')" "$short")
    [ "$st" != "working" ] && break
    sleep "$iv"
  done
  echo "WAIT-DONE worker=$short state=$st"
  echo "--- logs 尾巴 ---"
  claude logs "$short" 2>/dev/null | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | grep -v '^[[:space:]]*$' | tail -40
}

# 入口包函式：bash 讀完全檔才執行，執行中編輯本檔（長跑的 wait）不會讀到位移內容炸語法
main() {
  case "${1:-}" in
    dispatch) shift; cmd_dispatch "$@" ;;
    resume)   shift; cmd_resume "$@" ;;
    redispatch) shift; cmd_redispatch "$@" ;;
    close)    shift; cmd_close "$@" ;;
    wait)     shift; cmd_wait "$@" ;;
    *) sed -n '2,25p' "$0"; exit 1 ;;
  esac
}
main "$@"
