"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TeamScoreProps {
  score: number;
  className?: string;
}

export function TeamScore({ score, className }: TeamScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Fraco';
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            className={getScoreColor(score)}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{
              strokeDasharray: 440,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn('text-4xl font-bold', getScoreColor(score))}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={cn('mt-4 text-lg font-semibold', getScoreColor(score))}
      >
        {getScoreLabel(score)}
      </motion.p>
    </div>
  );
}

