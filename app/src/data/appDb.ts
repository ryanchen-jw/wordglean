// App 執行期唯一的資料庫實例；畫面與同步（TASK-20）都從這裡取用
import { createDb } from './db'

export const db = createDb()
