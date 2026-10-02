# 測試音檔出處與授權

- 來源：LibriSpeech ASR corpus（Vassil Panayotov, Guoguo Chen, Daniel Povey, Sanjeev Khudanpur），test-clean 子集前 10 句（說話者 6930、章節 75918、0000–0009）
- 原始授權：**CC BY 4.0**（https://creativecommons.org/licenses/by/4.0/）；語料出處 https://www.openslr.org/12
- 取得方式：複製自 `prototypes/voice-poc/fixtures/librispeech/`（TASK-1，經 Hugging Face datasets-server `openslr/librispeech_asr` 取得）
- 修改：FLAC 以 ffmpeg 轉成 16 kHz、單聲道、16-bit WAV；內容未剪輯。`manifest.json` 的 `text` 為語料附的標準轉寫（全大寫、無標點）
- 用途：只供 TASK-14 語音辨識整合測試（`app/e2e-speech/stt-real.spec.ts`），不進 app 建置、不隨產品發佈；歸屬見 repo 根 `NOTICE`
