// 題型畫面登記表：與引擎的題型登記（lesson/queue.ts READ_TYPES、LISTEN_TYPES）成對；說寫由 TASK-14～15 加入
import type { ComponentType } from 'react'
import type { ItemType } from '../../lesson/items'
import { ListenChoiceView } from './ListenChoiceView'
import { ListenTypeView } from './ListenTypeView'
import { McqView } from './McqView'
import { ReadingView } from './ReadingView'
import type { QuestionProps } from './types'
import { WordCardView } from './WordCardView'

export const QUESTION_VIEWS: Partial<Record<ItemType, ComponentType<QuestionProps>>> = {
  wordCard: WordCardView as ComponentType<QuestionProps>,
  mcq: McqView as ComponentType<QuestionProps>,
  reading: ReadingView as ComponentType<QuestionProps>,
  listenType: ListenTypeView as ComponentType<QuestionProps>,
  listenChoice: ListenChoiceView as ComponentType<QuestionProps>,
}
