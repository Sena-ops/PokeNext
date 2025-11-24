'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Swords, Sparkles, Users, Calculator, Book } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const quickActions = [
  {
    label: 'Novo Time',
    icon: Plus,
    href: '/team-builder',
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Batalhar',
    icon: Swords,
    href: '/battle-sim',
    color: 'from-red-500 to-red-600'
  },
  {
    label: 'AI Coach',
    icon: Sparkles,
    href: '/ai-coach',
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'Analisar Time',
    icon: Users,
    href: '/team-analysis',
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Calculadoras',
    icon: Calculator,
    href: '/tools',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    label: 'Pokédex',
    icon: Book,
    href: '/flavor',
    color: 'from-orange-500 to-orange-600'
  }
]

export function QuickActionsWidget({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às funcionalidades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-all cursor-pointer">
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                    action.color
                  )} />
                  <div className="relative">
                    <div className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                      action.color
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
