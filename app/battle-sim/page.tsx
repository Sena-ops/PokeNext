"use client";

import { motion } from 'framer-motion';
import { BattleSimulator } from '@/components/battle/BattleSimulator';
import { Swords } from 'lucide-react';

export default function BattleSimPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Swords className="w-10 h-10 text-red-500" />
          <h1 className="text-4xl font-bold">Battle Simulator</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Simule batalhas Pokémon e teste suas estratégias!
        </p>
      </motion.div>

      <BattleSimulator />
    </div>
  );
}
