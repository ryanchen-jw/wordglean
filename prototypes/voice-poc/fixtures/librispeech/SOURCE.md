# 測試音檔出處與授權

- 來源：LibriSpeech ASR corpus（Vassil Panayotov, Guoguo Chen, Daniel Povey, Sanjeev Khudanpur），test-clean 子集前 10 句（說話者 6930、章節 75918、0000–0009）
- 原始授權：**CC BY 4.0**（https://creativecommons.org/licenses/by/4.0/）；語料出處 https://www.openslr.org/12
- 取得方式：Hugging Face datasets-server（`openslr/librispeech_asr`，config `clean`，split `test`，offset 0–9）
- 修改：FLAC 以 ffmpeg 轉成 16 kHz、單聲道、16-bit WAV；內容未剪輯。`manifest.json` 的 `text` 為語料附的標準轉寫（全大寫、無標點）
- 用途：只供 `prototypes/voice-poc` 量測 Moonshine 逐字正確率，不進 app、不隨產品發佈
