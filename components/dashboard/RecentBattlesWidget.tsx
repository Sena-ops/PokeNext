'use client'

import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Trophy, Skull, Minus, Swords } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function RecentBattlesWidget({ className }: { className?: string }) {
  const { battleHistory } = useAppStore()
  const recentBattles = battleHistory.slice(-5).reverse()

  const getResultIcon = (winner: string) => {
    switch (winner) {
      case 'team1':
        return Trophy
      case 'team2':
        return Skull
      default:
        return Minus
    }
  }

  const getResultColor = (winner: string) => {
    switch (winner) {
      case 'team1':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'team2':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      default:
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    }
  }

  const getResultLabel = (winner: string) => {
    switch (winner) {
      case 'team1':
        return 'Vitória'
      case 'team2':
        return 'Derrota'
      default:
        return 'Empate'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Batalhas Recentes</CardTitle>
          <CardDescription>Últimos {recentBattles.length} resultados</CardDescription>
        </div>
        <Link href="/battle-sim">
          <Button variant="ghost" size="sm">
            Ver todas
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentBattles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Swords className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Nenhuma batalha registrada
            </p>
            <Link href="/battle-sim">
              <Button size="sm">
                Iniciar Batalha
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBattles.map((battle, index) => {
              const Icon = getResultIcon(battle.winner)
              return (
                <div
                  key={battle.id || index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg border flex items-center justify-center",
                    getResultColor(battle.winner)
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {getResultLabel(battle.winner)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(battle.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {battle.turns && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{battle.turns}</p>
                      <p className="text-xs text-muted-foreground">turnos</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
