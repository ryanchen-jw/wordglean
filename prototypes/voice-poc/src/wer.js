// 逐字正確率：單字層編輯距離（替換／刪除／插入各 1）。正確率＝1 − 錯數／參考字數。

export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

export function wordErrors(reference, hypothesis) {
  const ref = normalize(reference);
  const hyp = normalize(hypothesis);
  let prev = Array.from({ length: hyp.length + 1 }, (_, j) => j);
  for (let i = 1; i <= ref.length; i++) {
    const cur = [i];
    for (let j = 1; j <= hyp.length; j++) {
      const sub = prev[j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1);
      cur[j] = Math.min(sub, prev[j] + 1, cur[j - 1] + 1);
    }
    prev = cur;
  }
  return { errors: prev[hyp.length], refWords: ref.length };
}

export function corpusAccuracy(results) {
  const errors = results.reduce((s, r) => s + r.errors, 0);
  const words = results.reduce((s, r) => s + r.refWords, 0);
  return Math.max(0, 1 - errors / words);
}
