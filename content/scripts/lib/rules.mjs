// 排課數量規則：validator 與 allocator 共用。

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const LESSON_MIN_WORDS = 6;
export const LESSON_MAX_WORDS = 10;
export const LESSON_TARGET_WORDS = 8;
export const UNIT_MAX_LESSONS = 10;

// n 個字切成幾課：最接近每課 8 字、且每課落在 6–10 字；切不出來回 null（n<6 或 n=11）。
export function lessonCount(n) {
  const lo = Math.ceil(n / LESSON_MAX_WORDS);
  const hi = Math.floor(n / LESSON_MIN_WORDS);
  if (lo > hi) return null;
  return Math.min(hi, Math.max(lo, Math.round(n / LESSON_TARGET_WORDS)));
}
