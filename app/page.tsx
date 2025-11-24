'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { QuickStatsBar } from '@/components/dashboard/QuickStatsBar'
import { CurrentTeamWidget } from '@/components/dashboard/CurrentTeamWidget'
import { WeatherWidget } from '@/components/dashboard/WeatherWidget'
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget'
import { RecentBattlesWidget } from '@/components/dashboard/RecentBattlesWidget'
import { AchievementProgressWidget } from '@/components/dashboard/AchievementProgressWidget'

export default function DashboardPage() {
  const { userProfile } = useAppStore()

  const userName = userProfile?.name || 'Treinador'
  const level = userProfile?.level || 1
  const currentXP = userProfile?.xp || 0
  const nextLevelXP = level * 100
  const xpProgress = (currentXP / nextLevelXP) * 100

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Pronto para treinar e evoluir seu time?
            </p>
          </div>

          {/* Level Badge */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 min-w-[180px] shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Nível</span>
              <span className="text-2xl font-bold">{level}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs mt-1 opacity-90">
              {currentXP} / {nextLevelXP} XP
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <QuickStatsBar />
      </motion.div>

      {/* Dashboard Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-12 gap-6"
      >
        {/* Current Team - Takes 8 columns on large screens, full width on mobile */}
        <CurrentTeamWidget className="col-span-12 lg:col-span-8" />

        {/* Weather Widget - Takes 4 columns on large screens, full width on mobile */}
        <WeatherWidget className="col-span-12 lg:col-span-4" />

        {/* Quick Actions - Takes 4 columns on large screens, full width on mobile */}
        <QuickActionsWidget className="col-span-12 md:col-span-6 lg:col-span-4" />

        {/* Recent Battles - Takes 4 columns on large screens */}
        <RecentBattlesWidget className="col-span-12 md:col-span-6 lg:col-span-4" />

        {/* Achievement Progress - Takes 4 columns on large screens */}
        <AchievementProgressWidget className="col-span-12 lg:col-span-4" />

        {/* Activity Feed - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-12"
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">
                    Bem-vindo ao PokéTeam Trainer! Comece criando seu primeiro time.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Agora</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
