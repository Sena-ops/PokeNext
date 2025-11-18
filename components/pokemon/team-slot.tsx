"use client";

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TeamPokemon } from '@/types/pokemon';
import { PokemonCard } from './pokemon-card';
import { cn } from '@/lib/utils';

interface TeamSlotProps {
  pokemon: TeamPokemon | null;
  position: number;
  onRemove: () => void;
  className?: string;
}

export function TeamSlot({ pokemon, position, onRemove, className }: TeamSlotProps) {
  if (pokemon) {
    return (
      <div className={cn('', className)}>
        <PokemonCard pokemon={pokemon} onRemove={onRemove} />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn('glass rounded-lg p-8 border-2 border-dashed', className)}
    >
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Plus className="w-12 h-12 mb-2" />
        <p className="text-sm font-medium">Slot {position + 1}</p>
        <p className="text-xs">Vazio</p>
      </div>
    </motion.div>
  );
}

