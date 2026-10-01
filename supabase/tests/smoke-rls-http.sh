#!/usr/bin/env bash
# TASK-19 真入口 smoke：經 GoTrue 註冊 A、B 兩個使用者，經 PostgREST 驗證 A 讀寫不到 B 的資料。
# 前置：repo 根目錄已 `npx --yes supabase@2.118.0 start`。用法：bash supabase/tests/smoke-rls-http.sh
# 每次用新的 email，可重跑；殘留使用者在下次 `db reset` 清掉。
set -euo pipefail

eval "$(npx --yes supabase@2.118.0 status -o env 2>/dev/null | grep -E '^(API_URL|ANON_KEY)=')"
: "${API_URL:?supabase 未啟動}" "${ANON_KEY:?supabase 未啟動}"

fail=0
body_file=$(mktemp)
trap 'rm -f "$body_file"' EXIT
check() { # check <說明> <期望> <實際>
  if [[ "$3" == "$2" ]]; then echo "ok   - $1"; else echo "FAIL - $1（期望 $2，實得 $3）"; fail=1; fi
}

stamp=$(date -u +%Y%m%d%H%M%S)$RANDOM
signup() { # signup <email> → 印 "<user_id> <access_token>"
  local body
  body=$(curl -sS -X POST "$API_URL/auth/v1/signup" -H "apikey: $ANON_KEY" \
    -H 'Content-Type: application/json' -d "{\"email\":\"$1\",\"password\":\"smoke-pass-123\"}")
  echo "$(sed -n 's/.*"user":{"id":"\([^"]*\)".*/\1/p' <<<"$body") $(sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p' <<<"$body")"
}
read -r A_ID A_TOKEN <<<"$(signup "a$stamp@test.local")"
read -r B_ID B_TOKEN <<<"$(signup "b$stamp@test.local")"
[[ -n "$A_TOKEN" && -n "$B_TOKEN" ]] || { echo "FAIL - 註冊未取得 token"; exit 1; }

rest() { # rest <token|-> <method> <path> [body] → 印 "<http_code> <body>"
  local auth=()
  [[ "$1" != "-" ]] && auth=(-H "Authorization: Bearer $1")
  curl -sS -o "$body_file" -w '%{http_code}' -X "$2" "$API_URL/rest/v1/$3" \
    -H "apikey: $ANON_KEY" "${auth[@]}" -H 'Content-Type: application/json' \
    -H 'Prefer: return=representation' ${4:+-d "$4"}
  echo " $(cat "$body_file")"
}

check "A 寫入自己的收藏" 201 "$(rest "$A_TOKEN" POST favorites "{\"user_id\":\"$A_ID\",\"word_id\":\"apple\"}" | cut -d' ' -f1)"
check "B 寫入自己的收藏" 201 "$(rest "$B_TOKEN" POST favorites "{\"user_id\":\"$B_ID\",\"word_id\":\"bread\"}" | cut -d' ' -f1)"
check "A 讀收藏只看到自己" '200 [{"word_id":"apple"}]' "$(rest "$A_TOKEN" GET 'favorites?select=word_id')"
check "A 以 B 的 user_id 寫入被拒" 403 "$(rest "$A_TOKEN" POST favorites "{\"user_id\":\"$B_ID\",\"word_id\":\"cat\"}" | cut -d' ' -f1)"
check "A 改 B 的收藏影響 0 列" '200 []' "$(rest "$A_TOKEN" PATCH "favorites?user_id=eq.$B_ID" '{"deleted_at":"2026-10-01T00:00:00Z"}')"
check "A 刪 B 的收藏影響 0 列" '200 []' "$(rest "$A_TOKEN" DELETE "favorites?user_id=eq.$B_ID")"
check "B 的收藏原封不動" '200 [{"word_id":"bread","deleted_at":null}]' "$(rest "$B_TOKEN" GET 'favorites?select=word_id,deleted_at')"
check "未登入（anon）讀收藏被拒" 401 "$(rest - GET 'favorites?select=word_id' | cut -d' ' -f1)"

exit $fail
