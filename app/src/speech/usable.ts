/** 跟讀可用＝能錄音且能跑本機辨識（WebAssembly），或已同意瀏覽器語音辨識後備（TASK-14 D8）；題型替代規則用（TASK-18 capabilities） */
export const isSttUsable = (canRecord: boolean, wasm: boolean, webConsented: boolean) =>
  (canRecord && wasm) || webConsented
