"use client";

import { motion } from 'framer-motion';
import { AchievementPanel } from '@/components/achievements/AchievementPanel';
import { Trophy } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <h1 className="text-4xl font-bold">Conquistas</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Desbloqueie conquistas, ganhe XP e suba de nível!
        </p>
      </motion.div>

      <AchievementPanel />
    </div>
  );
}
