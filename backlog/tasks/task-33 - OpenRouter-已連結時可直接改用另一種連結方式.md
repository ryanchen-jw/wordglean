---
id: TASK-33
title: OpenRouter 已連結時可直接改用另一種連結方式
status: In Progress
assignee: []
created_date: '2026-11-12 17:18'
labels:
  - app
dependencies: []
priority: medium
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 裁示（選 A：連結後可直接改用另一種方式，不必先解除連結）。

【需求】
OpenRouter 已連結時，可以直接改用另一種連結方式（帳號一鍵授權 ↔ 貼上金鑰），不必先按「解除連結」。

【現況（已實證）】
- 未連結時兩種方式都有（app/src/screens/settings/AiSection.tsx:235 起：一鍵授權按鈕＋「改用貼上金鑰」）。
- 已連結時只剩模型、額度、測試、解除連結（AiSection.tsx:273 起）。
- 連結紀錄已存連結方式 via: oauth 或 paste（app/src/data/db.ts:56）；saveLink 會覆寫舊金鑰並保留已選模型（app/src/llm/keyStore.ts:19）。
- 授權回呼與貼金鑰成功後都導回 /settings（OpenRouterCallback.tsx:33、OpenRouterKeyScreen.tsx:50）。

【範圍】
做：已連結狀態依目前方式顯示另一種方式的入口：帳號授權者顯示「改用貼上金鑰」，貼金鑰者顯示「改用 OpenRouter 帳號授權」（文案盡量沿用既有 settings.ai.pasteKey、oauthButton，若需新文案列出供創辦人逐字審）。切換成功後覆寫為新金鑰、保留已選模型；切換途中取消或失敗，原連結不變。
不做：不同時保存兩組金鑰、不改模型選擇與測試按鈕、不改授權流程本身。

【邊界】
只動 AI 設定區與相關測試；與 TASK-34（高音質發音）無檔案重疊，可並行。

dev-flow 情境：小功能。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 帳號授權連結時顯示「改用貼上金鑰」；貼金鑰連結時顯示改用帳號授權的入口
- [ ] #2 從已連結狀態完成另一種方式後，金鑰被替換、連結方式更新、已選模型保留，回到設定頁顯示已連結
- [ ] #3 切換途中取消或失敗（授權被拒、貼了無效金鑰後離開），原連結完全不變
- [ ] #4 lint、typecheck、npm test、build 過；openrouter、openrouter-visual e2e 兩引擎綠；設定頁 AI 區截圖（兩種連結方式）320 寬與特大字級無溢出
<!-- AC:END -->
