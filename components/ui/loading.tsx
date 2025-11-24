import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
}

export function Loading({ className, size = 'md', text }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Loading text="Carregando..." />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loading size="lg" text="Carregando..." />
    </div>
  )
}
