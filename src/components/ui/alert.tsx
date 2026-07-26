import * as React from 'react'
import { cn } from '../../lib/utils'

type AlertVariant = 'default' | 'destructive'

const variantClasses: Record<AlertVariant, string> = {
  default:
    'border-[color-mix(in_oklab,var(--lagoon-deep)_28%,var(--line))] bg-[color-mix(in_oklab,var(--lagoon)_12%,var(--surface-strong))] text-[var(--sea-ink)]',
  destructive:
    'border-[rgba(196,71,71,0.36)] bg-[rgba(196,71,71,0.11)] text-[var(--sea-ink)]',
}

export function Alert({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  variant?: AlertVariant
}) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm shadow-[0_1px_0_var(--inset-glint)_inset]',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mb-1 font-semibold leading-none tracking-normal', className)}
      {...props}
    />
  )
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-sm leading-6 text-[var(--sea-ink-soft)]', className)}
      {...props}
    />
  )
}
