"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/app';
import { Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; rotation: number }>>([]);

  useEffect(() => {
    // Criar confetti
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      rotation: Math.random() * 360,
    }));
    setConfetti(particles);

    // Auto fechar após 5 segundos
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="fixed top-4 right-4 z-50 w-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-2xl p-6 border-4 border-yellow-300"
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x * 3,
              y: particle.y * 3,
              opacity: 0,
              scale: 0,
              rotate: particle.rotation,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 w-3 h-3"
          >
            <div className="w-full h-full bg-yellow-200 rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/20 hover:bg-black/30"
        >
          <X className="h-4 w-4 text-white" />
        </Button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              {achievement.icon}
            </div>
          </motion.div>

          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Conquista Desbloqueada!</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{achievement.name}</h3>
            <p className="text-sm text-white/90 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="bg-white/20 px-2 py-1 rounded">+{achievement.points} XP</span>
              <span className="bg-white/20 px-2 py-1 rounded capitalize">{achievement.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shine effect */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ transform: 'skewX(-20deg)' }}
      />
    </motion.div>
  );
}

interface AchievementToastContainerProps {
  achievements: Achievement[];
}

export function AchievementToastContainer({ achievements }: AchievementToastContainerProps) {
  const [toasts, setToasts] = useState<Achievement[]>(achievements);

  useEffect(() => {
    setToasts(achievements);
  }, [achievements]);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AnimatePresence>
      {toasts.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          style={{ top: `${4 + index * 180}px` }}
          className="fixed right-4 z-50"
        >
          <AchievementToast
            achievement={achievement}
            onClose={() => handleClose(achievement.id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
