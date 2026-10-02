// 題型畫面登記表：與引擎的題型登記（lesson/queue.ts READ／LISTEN／SPEAK／WRITE_TYPES）成對
import type { ComponentType } from 'react'
import type { ItemType } from '../../lesson/items'
import { ListenChoiceView } from './ListenChoiceView'
import { ListenTypeView } from './ListenTypeView'
import { McqView } from './McqView'
import { ReadingView } from './ReadingView'
import { ShadowingView } from './ShadowingView'
import type { QuestionProps } from './types'
import { WordCardView } from './WordCardView'
import { WritingView } from './WritingView'

export const QUESTION_VIEWS: Partial<Record<ItemType, ComponentType<QuestionProps>>> = {
  wordCard: WordCardView as ComponentType<QuestionProps>,
  mcq: McqView as ComponentType<QuestionProps>,
  reading: ReadingView as ComponentType<QuestionProps>,
  listenType: ListenTypeView as ComponentType<QuestionProps>,
  listenChoice: ListenChoiceView as ComponentType<QuestionProps>,
  shadowing: ShadowingView as ComponentType<QuestionProps>,
  translate: WritingView as ComponentType<QuestionProps>,
  makeSentence: WritingView as ComponentType<QuestionProps>,
}
