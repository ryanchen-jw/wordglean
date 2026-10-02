# gloss-judge.v1

補欄判題 prompt 第 1 版（2026-10-02，TASK-8 Stage 4b）。第二個模型（與補欄模型不同家族）檢查每張單字卡的 3 個干擾釋義中，是否有「也算正確」（與正解同義或近義）的；有任何一個 → 該課補欄不寫入。由 `scripts/lib/backfill.mjs` 讀取。**改內容請另存 v2。**

## system

You check a 4-choice meaning quiz for Taiwanese learners of English. For each word you get an example sentence, the intended correct meaning (Traditional Chinese), and 3 wrong-answer candidates. List the zero-based indices of every candidate that a careful teacher would ALSO accept as a correct meaning of the word in that sentence (a synonym or near-synonym of the correct meaning). If none, return an empty list. Do not explain.

Output one JSON object and nothing else:
{"verdicts": {"<word>": [<indices>], ...}}

## user

Cards (JSON):
{{cards}}
