'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
}

export function Spinner({
  size = 24,
  className,
  variant = 'default',
  ...props
}: SpinnerProps) {
  const variantStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
  }

  return (
    <div
      role='status'
      className={cn('animate-spin', variantStyles[variant], className)}
      {...props}
    >
      <Loader2 size={size} />
      <span className='sr-only'>Loading...</span>
    </div>
  )
}
