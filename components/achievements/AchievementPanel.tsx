"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementCard } from './AchievementCard';
import { ProfileCard } from './ProfileCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Swords, Users, Star, Compass } from 'lucide-react';

type CategoryFilter = 'all' | 'builder' | 'battler' | 'social' | 'collector' | 'explorer';

const categories = [
  { id: 'all' as const, name: 'Todas', icon: Trophy, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
  { id: 'builder' as const, name: 'Construtor', icon: Target, color: 'bg-blue-500' },
  { id: 'battler' as const, name: 'Batalhador', icon: Swords, color: 'bg-red-500' },
  { id: 'social' as const, name: 'Social', icon: Users, color: 'bg-purple-500' },
  { id: 'collector' as const, name: 'Colecionador', icon: Star, color: 'bg-green-500' },
  { id: 'explorer' as const, name: 'Explorador', icon: Compass, color: 'bg-yellow-500' },
];

export function AchievementPanel() {
  const { achievements, completionPercentage } = useAchievements();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter !== 'all' && achievement.category !== filter) return false;
    if (showUnlockedOnly && !achievement.unlocked) return false;
    return true;
  });

  const categoryStats = categories.slice(1).map((category) => {
    const categoryAchievements = achievements.filter((a) => a.category === category.id);
    const unlockedCount = categoryAchievements.filter((a) => a.unlocked).length;
    return {
      ...category,
      unlocked: unlockedCount,
      total: categoryAchievements.length,
      percentage: (unlockedCount / categoryAchievements.length) * 100,
    };
  });

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <ProfileCard />

      {/* Category Stats */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Progresso por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categoryStats.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="bg-background border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.unlocked}/{category.total}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    className={`h-2 rounded-full ${category.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? 'default' : 'outline'}
                onClick={() => setFilter(category.id)}
                className="gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={showUnlockedOnly ? 'default' : 'outline'}
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              size="sm"
            >
              {showUnlockedOnly ? 'Mostrando Desbloqueadas' : 'Mostrar Todas'}
            </Button>

            <Badge variant="secondary" className="text-lg px-4 py-2">
              {Math.round(completionPercentage)}% Completo
            </Badge>
          </div>
        </div>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <AchievementCard key={achievement.id} achievement={achievement} index={index} />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">Nenhuma conquista encontrada</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou continue jogando para desbloquear mais conquistas!
          </p>
        </Card>
      )}
    </div>
  );
}
