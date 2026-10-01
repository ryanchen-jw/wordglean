# voice-poc——TASK-1 語音原型

量測 Kokoro TTS（kokoro-js）與 Moonshine tiny STT（transformers.js 直載 ONNX）在手機瀏覽器的可行性。結論與數據見 `docs/research/voice-poc.md`。獨立 package，不進 `app/`。

| 指令 | 作用 |
|---|---|
| `npm ci` | 安裝（在本資料夾內） |
| `npm run dev` | 本機開原型頁（http://localhost:5317） |
| `npm run test:unit` | 逐字正確率計算的單元測試 |
| `npm run measure` | build＋Playwright 量測（webkit＝iOS 代理、chromium＝Android 代理），結果寫 `results/*.json` |
| `node tests/gpu-probe.mjs` | 探測各瀏覽器模式下 WebGPU 是否可用 |

網址參數：`device=auto|webgpu|wasm`、`ttsDtype=q8|fp32`、`sttDtype=q8`、`workers=1|2`（兩模型共用一支或各自一支 worker）。

## 授權

- 本原型程式碼：AGPL-3.0（同 repo）
- kokoro-js、@huggingface/transformers、phonemizer：Apache-2.0；Kokoro-82M 權重：Apache-2.0；Moonshine 英文模型：MIT
- 測試音檔：LibriSpeech，CC BY 4.0，見 `fixtures/librispeech/SOURCE.md`
