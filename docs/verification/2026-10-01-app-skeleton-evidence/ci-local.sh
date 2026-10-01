#!/usr/bin/env bash
# CI 本機等價：依 .github/workflows/ci.yml 的 step 順序，從乾淨 node_modules 重跑；任一步失敗即停
set -euo pipefail
WT=/c/Projects/LinguaApp/.claude/worktrees/app-skeleton
export CI=true
cd "$WT/app"
echo "== ci-local start $(TZ=CST-8 date '+%F %T') +08 | node $(node -v) | npm $(npm -v) | HEAD $(git -C "$WT" rev-parse --short HEAD)"
step() { echo; echo "== STEP: $*"; "$@"; echo "== OK: $*"; }
rm -rf "$WT/app/node_modules" "$WT/app/dist" "$WT/app/playwright-report" "$WT/app/test-results"
step npm ci
step npm run lint
step npm run typecheck
step npm test
# Windows 本機不適用 --with-deps（系統依賴安裝僅 Linux），其餘同 ci.yml
step npx playwright install webkit chromium
step npm run e2e
step npm run build
echo; echo "== ci-local ALL GREEN $(TZ=CST-8 date '+%F %T') +08"
