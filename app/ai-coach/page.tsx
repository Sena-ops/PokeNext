"use client";

import { motion } from 'framer-motion';
import { AICoachPanel } from '@/components/ai-coach/AICoachPanel';
import { Sparkles } from 'lucide-react';

export default function AICoachPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-10 h-10 text-purple-500" />
          <h1 className="text-4xl font-bold">AI Strategy Coach</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Professor Oak está aqui para analisar seu time e dar sugestões estratégicas!
        </p>
      </motion.div>

      <AICoachPanel />
    </div>
  );
}
