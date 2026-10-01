// 按鈕四變體（components.md §1）：主要／次要／文字／危險；按下只用縮放與底色，不改版面尺寸
import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'text' | 'danger'

const base =
  'flex items-center justify-center gap-2 transition-[transform,background-color] duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale) disabled:pointer-events-none'

// 全寬按鈕左右內距 16px：文字折行時（窄螢幕特大字級）不貼框
const variants: Record<Variant, string> = {
  primary:
    'min-h-13 w-full rounded-control px-4 bg-primary text-body font-bold text-on-primary active:bg-[color-mix(in_srgb,var(--lg-primary),var(--lg-text)_12%)] disabled:bg-disabled-bg disabled:text-disabled-text',
  secondary:
    'min-h-13 w-full rounded-control px-4 border border-border bg-surface text-body font-bold text-primary active:bg-primary-soft disabled:border-disabled-text disabled:text-disabled-text',
  danger:
    'min-h-13 w-full rounded-control px-4 border border-border bg-surface text-body font-bold text-error active:bg-primary-soft disabled:border-transparent disabled:bg-disabled-bg disabled:text-disabled-text',
  text: 'min-h-11 justify-start gap-1.5 font-medium text-primary active:bg-primary-soft disabled:text-disabled-text',
}

function buttonClass(variant: Variant, extra = '') {
  return `${base} ${variants[variant]} ${extra}`
}

type Props = ComponentProps<'button'> & { variant?: Variant }

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />
}
