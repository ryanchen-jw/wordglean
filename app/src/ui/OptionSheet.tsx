// 單選清單彈層（D8）：熟悉度篩選、每日新字數、外觀、字級共用；選了即關閉
import { Check } from 'lucide-react'
import { BottomSheet } from './BottomSheet'

type Props<T extends string | number> = {
  label: string
  options: readonly { value: T; label: string }[]
  selected: T
  onSelect: (value: T) => void
  onClose: () => void
}

export function OptionSheet<T extends string | number>({
  label,
  options,
  selected,
  onSelect,
  onClose,
}: Props<T>) {
  return (
    <BottomSheet label={label} onClose={onClose}>
      <h2 className="font-heading text-title-sm font-bold">{label}</h2>
      <ul role="listbox" aria-label={label} className="grid">
        {options.map((o) => (
          <li key={o.value} className="border-b border-line last:border-b-0">
            <button
              type="button"
              role="option"
              aria-selected={o.value === selected}
              onClick={() => {
                onSelect(o.value)
                onClose()
              }}
              className={`flex min-h-13 w-full items-center justify-between gap-3 text-left active:bg-primary-soft ${
                o.value === selected ? 'font-bold text-primary' : ''
              }`}
            >
              {o.label}
              {o.value === selected && <Check size={20} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  )
}
