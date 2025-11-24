import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useTeamStore } from '@/store/team-store';
import { AchievementTracker, allAchievements } from '@/lib/achievements/achievement-system';
import { Achievement } from '@/types/app';

export function useAchievements() {
  const { userProfile, achievements, unlockAchievement } = useAppStore();
  const { currentTeam } = useTeamStore();
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  // Inicializar achievements se estiver vazio
  useEffect(() => {
    if (achievements.length === 0) {
      useAppStore.setState({ achievements: allAchievements });
    }
  }, [achievements.length]);

  // Verificar achievements automaticamente
  const checkAndUnlock = () => {
    const unlockedIds = AchievementTracker.checkAchievements(userProfile, {
      currentTeam,
    });

    unlockedIds.forEach((id) => {
      const achievement = allAchievements.find((a) => a.id === id);
      if (achievement && !achievement.unlocked) {
        unlockAchievement(id);
        setRecentUnlocks((prev) => [...prev, achievement]);

        // Remover da lista de recentes após 5 segundos
        setTimeout(() => {
          setRecentUnlocks((prev) => prev.filter((a) => a.id !== id));
        }, 5000);
      }
    });
  };

  // Calcular estatísticas
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  const pointsByCategory = {
    builder: achievements
      .filter((a) => a.category === 'builder' && a.unlocked)
      .reduce((sum, a) => sum + a.points, 0),
    battler: achievements
      .filter((a) => a.category === 'battler' && a.unlocked)
      .reduce((sum, a) => sum + a.points, 0),
    social: achievements
      .filter((a) => a.category === 'social' && a.unlocked)
      .reduce((sum, a) => sum + a.points, 0),
    collector: achievements
      .filter((a) => a.category === 'collector' && a.unlocked)
      .reduce((sum, a) => sum + a.points, 0),
    explorer: achievements
      .filter((a) => a.category === 'explorer' && a.unlocked)
      .reduce((sum, a) => sum + a.points, 0),
  };

  const level = AchievementTracker.calculateLevel(userProfile.xp);
  const levelProgress = AchievementTracker.getLevelProgress(userProfile.xp);
  const nextLevelXP = AchievementTracker.getXPForNextLevel(userProfile.xp);
  const title = AchievementTracker.getTitle(level);

  return {
    achievements,
    unlockedCount,
    totalCount,
    completionPercentage,
    pointsByCategory,
    level,
    levelProgress,
    nextLevelXP,
    title,
    recentUnlocks,
    checkAndUnlock,
    unlockAchievement,
  };
}
