'use client'

import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, Trophy, Lock } from 'lucide-react'
import Link from 'next/link'

export function AchievementProgressWidget({ className }: { className?: string }) {
  const { achievements } = useAppStore()

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const progress = (unlockedCount / totalCount) * 100

  const recentAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => {
      const timeA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0
      const timeB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0
      return timeB - timeA
    })
    .slice(0, 3)

  const nextAchievements = achievements
    .filter(a => !a.unlocked)
    .slice(0, 2)

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Conquistas</CardTitle>
          <CardDescription>
            {unlockedCount} de {totalCount} desbloqueadas
          </CardDescription>
        </div>
        <Link href="/achievements">
          <Button variant="ghost" size="sm">
            Ver todas
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Total</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Recentes</p>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">+{achievement.points} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Achievements */}
        {nextAchievements.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Próximas</p>
            <div className="space-y-2">
              {nextAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
