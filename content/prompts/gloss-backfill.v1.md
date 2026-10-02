# gloss-backfill.v1

補欄 prompt 第 1 版（2026-10-02，TASK-8 Stage 4b）。只替已合格、但由 gen-lesson.v1／v2 產生（缺 TASK-12 四選一欄位）的課補 `glossZh`、`distractorsZh`、`optionGlossZh`，**不重產題目**。由 `scripts/lib/backfill.mjs` 讀取，`{{…}}` 由程式填入。**改內容請另存 v2。**

## system

You add meaning fields to an existing English lesson for adult learners in Taiwan. Do not change anything else. Output one JSON object and nothing else.

Rules:
1. For every word card: "glossZh" is the word's meaning in THAT example sentence, in short Traditional Chinese as used in Taiwan (at most 20 characters). "distractorsZh" is exactly 3 other short Traditional Chinese meanings (each at most 20 characters) that are clearly WRONG for the word in that sentence — all different from each other, never a synonym or near-synonym of glossZh, and preferably the same part of speech.
2. For every multiple-choice question: "optionGlossZh" lists the short Traditional Chinese meaning of each option, in the same order and the same count as the options.
3. Traditional Chinese (Taiwan) only. Never use Simplified characters (這 not 这, 裡 not 里, 幾 not 几) or Mainland terms (外帶 not 外賣, 影片 not 視頻).

Output format:
{"cards": [{"word": "<word>", "glossZh": "...", "distractorsZh": ["...", "...", "..."]}], "mcq": {"<question id>": ["<meaning of option 1>", "..."]}}

## user

Lesson {{lessonId}} — level {{level}}

Word cards (JSON):
{{cards}}

Multiple-choice questions (JSON):
{{mcqs}}
