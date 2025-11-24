"use client";

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { useAchievements } from '@/hooks/useAchievements';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Swords, Heart, Star, TrendingUp } from 'lucide-react';

export function ProfileCard() {
  const { userProfile } = useAppStore();
  const { level, levelProgress, nextLevelXP, title, unlockedCount, totalCount, pointsByCategory } =
    useAchievements();

  const stats = [
    { icon: Target, label: 'Times Criados', value: userProfile.stats.teamsCreated, color: 'text-blue-500' },
    { icon: Swords, label: 'Batalhas Vencidas', value: userProfile.stats.battlesWon, color: 'text-red-500' },
    { icon: Heart, label: 'Times Compartilhados', value: userProfile.stats.sharedTeams, color: 'text-purple-500' },
    { icon: Star, label: 'Pokémon Coletados', value: userProfile.stats.pokemonCollected, color: 'text-green-500' },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-pokemon-red/10 to-pokemon-yellow/10">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pokemon-red to-pokemon-yellow p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl">
              {userProfile.avatar || '👤'}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-pokemon-yellow text-pokemon-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg border-4 border-background">
            {level}
          </div>
        </motion.div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
            <Badge className="bg-gradient-to-r from-pokemon-red to-pokemon-yellow text-white">
              {title}
            </Badge>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Nível {level}</span>
              <span className="font-bold">
                {userProfile.xp} / {nextLevelXP} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-pokemon-red to-pokemon-yellow rounded-full relative overflow-hidden"
              >
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          {/* Achievement stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-lg">
                {unlockedCount}/{totalCount}
              </span>
              <span className="text-sm text-muted-foreground">Conquistas</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-bold text-lg">{userProfile.stats.maxWinStreak}</span>
              <span className="text-sm text-muted-foreground">Melhor Sequência</span>
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="bg-background/50 rounded-lg p-3 border"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Category points */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase">Pontos por Categoria</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(pointsByCategory).map(([category, points]) => (
            <div key={category} className="text-center">
              <p className="text-xl font-bold text-pokemon-yellow">{points}</p>
              <p className="text-xs text-muted-foreground capitalize">{category}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
