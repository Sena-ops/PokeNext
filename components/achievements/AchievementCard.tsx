"use client";

import { motion } from 'framer-motion';
import { Achievement } from '@/types/app';
import { Lock, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const categoryColors = {
  builder: 'bg-blue-500',
  battler: 'bg-red-500',
  social: 'bg-purple-500',
  collector: 'bg-green-500',
  explorer: 'bg-yellow-500',
};

export function AchievementCard({ achievement, index }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Card
        className={`p-4 h-full relative overflow-hidden transition-all ${
          achievement.unlocked
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400'
            : 'bg-card opacity-60 grayscale'
        }`}
      >
        {/* Background icon */}
        <div className="absolute -right-4 -top-4 text-8xl opacity-10">
          {achievement.icon}
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2">
          {achievement.unlocked ? (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="text-5xl mb-3">{achievement.icon}</div>

          {/* Category badge */}
          <Badge className={`${categoryColors[achievement.category]} text-white mb-2`}>
            {achievement.category}
          </Badge>

          {/* Title and description */}
          <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {achievement.description}
          </p>

          {/* Progress bar (if applicable) */}
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progresso</span>
                <span>
                  {Math.round(achievement.progress * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress * 100}%` }}
                  className={`h-2 rounded-full ${categoryColors[achievement.category]}`}
                />
              </div>
            </div>
          )}

          {/* Points */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              {achievement.points} XP
            </span>
            {achievement.unlocked && achievement.unlockedAt && (
              <span className="text-xs text-muted-foreground">
                {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        {/* Shine effect for unlocked achievements */}
        {achievement.unlocked && (
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
      </Card>
    </motion.div>
  );
}
