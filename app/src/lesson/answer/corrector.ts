// 移植自 LibreLingo answer-corrector（AGPL-3.0-or-later）：
//   kantord/LibreLingo apps/answer-corrector/src/index.ts（commit 0dc960e 的父 commit）；
//   延續版 LibreLingoRelive/LibreLingoRelive 同路徑（commit 451f9a0）邏輯相同
// 修改：Levenshtein 由 js-levenshtein／leven 改用本目錄 levenshtein.ts（同為逐 UTF-16 碼元比對）；排版照本專案 Prettier
// App 的聽音打字判題不用本檔（設計 v1.0 要求拼錯即算錯，見 check.ts）；保留供等價測試（TASK-13 AC#4）
import { distance } from './levenshtein'

const id = (x: string): string => x

const ignorePunctuation = (form: string): string => form.replace(/[!¡?¿,.]/g, '')
const ignoreCasing = (form: string): string => form.toLowerCase()
const ignoreWhitespace = (form: string): string =>
  form.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ')

const normalize = (form: string): string => ignoreWhitespace(ignoreCasing(form))

const areSentencesSimilar = (sentence1: string, sentence2: string): boolean =>
  distance(normalize(sentence1), normalize(sentence2)) <= 1

const areSentencesIdentical = (sentence1: string, sentence2: string): boolean =>
  normalize(sentence1) === normalize(sentence2)

const getSuggestion = ({
  alwaysSuggest,
  answer,
  mappedForm,
  suggester,
  form,
}: {
  alwaysSuggest?: boolean
  answer: string
  mappedForm: string
  suggester: (form: string) => string
  form: string
}): string => (!alwaysSuggest && areSentencesIdentical(answer, mappedForm) ? '' : suggester(form))

const evaluateAnswerRaw = ({
  validAnswers,
  answer,
  suggester,
  alwaysSuggest,
  mapper,
}: {
  validAnswers: string[]
  answer: string
  suggester: (form: string) => string
  alwaysSuggest?: boolean
  mapper: (form: string) => string
}): { correct: boolean; suggestion: string } => {
  let correct = false,
    suggestion = ''

  validAnswers.forEach((form) => {
    const mappedForm = mapper(form)
    if (areSentencesSimilar(answer, mappedForm)) {
      if (correct && !suggestion) {
        return
      }
      correct = true
      suggestion = getSuggestion({
        alwaysSuggest,
        answer,
        mappedForm,
        suggester,
        form,
      })
    }
  })

  return { correct, suggestion }
}

export function evaluateAnswer({
  validAnswers,
  answer,
}: {
  validAnswers: string[]
  answer: string
}): { correct: boolean; suggestion: string } {
  let result = evaluateAnswerRaw({
    mapper: id,
    validAnswers,
    answer,
    suggester: (form) => `Correct spelling: ${form}`,
  })

  if (!result.correct) {
    result = evaluateAnswerRaw({
      alwaysSuggest: true,
      validAnswers,
      mapper: ignorePunctuation,
      answer,
      suggester: (form) => `Watch out for punctuation! Correct spelling: ${form}`,
    })
  }

  return result
}
