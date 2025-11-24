'use client'

import { useAppStore } from '@/store/app-store'
import { useTeamStore } from '@/store/team-store'
import { Users, Swords, Trophy, TrendingUp } from 'lucide-react'

export function QuickStatsBar() {
  const { userProfile, battleHistory } = useAppStore()
  const { savedTeams } = useTeamStore()

  const wins = battleHistory.filter(b => b.winner === 'team1').length
  const totalBattles = battleHistory.length
  const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0

  const stats = [
    {
      label: 'Times Criados',
      value: savedTeams?.length || 0,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Batalhas',
      value: totalBattles,
      icon: Swords,
      color: 'text-red-500'
    },
    {
      label: 'Taxa de Vitória',
      value: `${winRate}%`,
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      label: 'Nível',
      value: userProfile?.level || 1,
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
