# 第 4 輪（2026-10-03，隔離驗收 FAIL 後補修）

驗收官指出：小課（看字選意、選擇題）與複習作答後的淡化選項 `[data-choice="dim"]` 文字 #8c877d／#fffcf5＝3.48:1（axe color-contrast serious，兩引擎），其中含仍可點的查義按鈕。依代決原則屬無障礙 P0，第 1–3 輪誤列 P2，本輪修正。

## 修正

| # | 問題 | 嚴重度 | 修法 | 測試 |
|---|---|---|---|---|
| 15 | 作答後淡化選項文字對比 3.48:1（含可點英文字） | 無障礙 P0 | 只改 `ChoiceOption` 的 dim 狀態樣式：文字 `text-disabled-text` → `text-muted`（tokens.test 已守 muted 對 surface ≥4.5:1，淺／深色），邊框改 `border-dashed border-border`——以虛線框作非色彩的「已淡化」區分；token 與其他狀態不動 | `e2e/a11y-answered.spec.ts`：小課第 1 題、選擇題、複習作答後 × 淺／深 × 兩引擎，axe critical／serious＝0。紅燈 12/12（`red-a11y-answered.log`）→ 修後綠 |
| 16 | 上述 axe 測試在 webkit 偶發紅（回饋條） | 測試量測 | 量前等 `document.getAnimations()` 結束：回饋條有淡入動畫，半透明中途被量成低對比 | 反證 `disprove-no-animation-wait.log`：不等動畫 webkit 選擇題 16 次紅 2 次、全在淡入中的回饋條；等動畫後 48/48 綠 |

前後截圖（chromium，看字選意答錯）：`dim-before-light.png`／`dim-after-light.png`、`dim-before-dark.png`／`dim-after-dark.png`。依賴：app 新增 devDependency `axe-core`（只供 e2e 注入）。

## 回歸

app 單元 818 綠／3 skip；主 e2e（--workers=2）webkit 111＋chromium 117 綠；sync 16 綠；旅程 --repeat-each=3 兩引擎 6/6 綠（`journey-x3.log`）；typecheck、eslint、prettier 綠。第 3 輪的「Standards 觀察」（可選）未處理。
