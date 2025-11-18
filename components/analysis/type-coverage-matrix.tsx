"use client";

import { motion } from 'framer-motion';
import { PokemonType } from '@/types/pokemon';
import { cn } from '@/lib/utils';

interface TypeCoverageMatrixProps {
  coverage: Record<PokemonType, number>;
  weaknesses: Record<PokemonType, number>;
}

const allTypes: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export function TypeCoverageMatrix({ coverage, weaknesses }: TypeCoverageMatrixProps) {
  const getColor = (value: number, max: number = 6) => {
    if (value === 0) return 'bg-gray-200 dark:bg-gray-700';
    const intensity = Math.min(value / max, 1);
    const green = Math.round(255 * (1 - intensity));
    const red = Math.round(255 * intensity);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="space-y-8">
      {/* Offensive Coverage */}
      <div>
        <h3 className="text-lg font-bold mb-4">Cobertura Ofensiva</h3>
        <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-9 gap-2">
          {allTypes.map((type, index) => {
            const value = coverage[type] || 0;
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'relative aspect-square rounded-lg flex flex-col items-center justify-center p-2 text-center group cursor-pointer',
                  value === 0 ? 'bg-gray-200 dark:bg-gray-700' : ''
                )}
                style={value > 0 ? { backgroundColor: getColor(value) } : {}}
              >
                <span className={cn(
                  'text-xs font-bold uppercase',
                  value > 2 ? 'text-white' : 'text-gray-900 dark:text-gray-300'
                )}>
                  {type.slice(0, 3)}
                </span>
                <span className={cn(
                  'text-lg font-bold',
                  value > 2 ? 'text-white' : 'text-gray-900 dark:text-gray-300'
                )}>
                  {value}
                </span>
                <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold capitalize px-2">
                    {type}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Defensive Weaknesses */}
      <div>
        <h3 className="text-lg font-bold mb-4">Fraquezas Defensivas</h3>
        <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-9 gap-2">
          {allTypes.map((type, index) => {
            const value = weaknesses[type] || 0;
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'relative aspect-square rounded-lg flex flex-col items-center justify-center p-2 text-center group cursor-pointer',
                  value === 0 ? 'bg-gray-200 dark:bg-gray-700' : ''
                )}
                style={value > 0 ? { backgroundColor: getColor(value) } : {}}
              >
                <span className={cn(
                  'text-xs font-bold uppercase',
                  value > 2 ? 'text-white' : 'text-gray-900 dark:text-gray-300'
                )}>
                  {type.slice(0, 3)}
                </span>
                <span className={cn(
                  'text-lg font-bold',
                  value > 2 ? 'text-white' : 'text-gray-900 dark:text-gray-300'
                )}>
                  {value}
                </span>
                <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold capitalize px-2">
                    {type}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

