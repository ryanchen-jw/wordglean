# 上線後待決事項（2026-11-05）

尚未開卡，由創辦人決定是否處理：

- 閱讀短文部分寬度出現行首逗號（408-413px 等）。候選修法 docs/pending/candidate-nowrap-wbr.patch，需放寬一條長字測試。
- 頁首分級結果 A2 與成長卡 A1 並存，邏輯正確但可能讓人困惑。
- Google 同意畫面顯示 supabase.co 網址；免費方案下暫無確定解法。
- 批改解釋有時重複，速度與品質隨模型波動。
- 整理項：docs/pending 截圖未進 .gitignore；NOTICE 待補字樣；README 授權表未列 docs、prototypes、.claude；Actions 版本未釘 SHA。
- 確認 GitHub 排程持續執行（keepalive），否則 Supabase 閒置 7 天會暫停。
