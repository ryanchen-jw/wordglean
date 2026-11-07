// 元件用的發音（TASK-32）：卸載（離開頁面、返回、換下一題、關閉字典彈層）時，
// 最後一次發音若仍是這個元件發起的就取消；已被別處新發音取代的不動，免得誤殺下一個畫面的發音
import { useCallback, useEffect, useState } from 'react'
import { speak, tts } from './speak'

let lastOwner: object | null = null

export function useSpeak(): typeof speak {
  const [owner] = useState(() => ({}))
  useEffect(
    () => () => {
      if (lastOwner !== owner) return
      lastOwner = null
      tts.cancel()
    },
    [owner],
  )
  return useCallback(
    (...args: Parameters<typeof speak>) => {
      lastOwner = owner
      return speak(...args)
    },
    [owner],
  )
}
