# TASK-7 Stage B2 冒煙紀錄（2026-10-01）

環境：Windows 11、Git Bash、Node 22.20.0、npm 10.9.3。乾淨副本＝`git archive HEAD`（4765c46）解到 job 暫存目錄，`npm ci` 後執行。

## 從零重建、位元組一致

1. 記錄已提交產出的 sha256：`a1.json a2.json b1.json b2.json c1.json STATS.md`
2. 刪除上述 6 檔（`curriculum/` 只剩 `topics.json`、`word-topics.json`）
3. `node scripts/build-curriculum.mjs` → `產生 5 個級距檔、984 堂小課；validator 全綠`
4. `sha256sum -c` → 6 檔全部 `OK`
5. `node scripts/validate-curriculum.mjs` → `檢查 5 個級距檔：全綠`、exit 0
6. `npm test`（乾淨副本）→ tests 37、pass 37、fail 0
7. worktree 內再跑一次 build → `git status` 無變動

## 負向

從乾淨副本的 `word-topics.json` 拿掉 A1 的 `apple` 後 build：

```
MISSING_WORD	A1	A1 的「apple」沒有主題分類
1 個錯誤，未寫檔
exit=1
```

`a1.json` 的 sha256 與執行前相同（未寫檔）。

## 突變（證明斷言有鑑別力，皆已還原）

| 突變 | 轉紅的測試 |
|---|---|
| 「取所有詞性最低級」改成取最高級 | 15 例（validate／cli） |
| 每課字數上限放寬 1 | `LESSON_SIZE：11／5 兩側越界` |
| 排序拿掉「多益常考優先」 | 排序、D2 合併 2 例 |
| 單元改為同主題相連（取消各主題第一單元優先） | 拆單元 1 例 |
| 目標字數 8 改 9 | 切課 1 例 |

## code review 後修正（低嚴重度 2 項）

- 問題：validate CLI 少一個級距檔仍報全綠；分類檔少一整級時 build 仍全綠且留下舊級距檔。
- 修法：`MISSING_WORD` 改為檢查 A1–C1 全部有級距的字（不再只看存在的級距）；validate CLI 另查檔名與檔內 level。
- 紅→綠：先加 4 例測試（缺級距檔、檔名不符、分類檔缺一級、validateCurriculum 缺級距），實跑 37 pass／4 fail；修正後 41 pass／0 fail。正式產出重建後 `git status` 無變動。
