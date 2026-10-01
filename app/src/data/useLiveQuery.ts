// 訂閱 Dexie liveQuery：資料變動（含清除、同步寫入）時自動重算；首次結果出來前回傳 undefined
import { liveQuery } from 'dexie'
import { useEffect, useState, type DependencyList } from 'react'

export function useLiveQuery<T>(query: () => Promise<T>, deps: DependencyList): T | undefined {
  const [value, setValue] = useState<T>()
  useEffect(() => {
    const sub = liveQuery(query).subscribe({ next: setValue, error: (e) => console.error(e) })
    return () => sub.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps 由呼叫端提供
  }, deps)
  return value
}
