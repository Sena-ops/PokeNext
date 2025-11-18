'use client';

import { Move } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TYPE_COLORS } from '@/lib/constants/pokemon-types';
import { PokemonType } from '@/types/pokemon';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Target, ArrowUp } from 'lucide-react';

interface MoveCardProps {
  move: Move;
  showLearnedBy?: boolean;
}

export function MoveCard({ move, showLearnedBy = false }: MoveCardProps) {
  const typeName = move.type.name as PokemonType;
  const typeColor = TYPE_COLORS[typeName]?.bg || '#A8A878';
  
  const damageClassIcons = {
    physical: '⚔️',
    special: '✨',
    status: '🛡️'
  };
  
  const effectText = move.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'No description available';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/moves/${move.name}`}>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge
                style={{ backgroundColor: typeColor, color: TYPE_COLORS[typeName]?.text }}
                className="text-xs font-semibold"
              >
                {typeName.toUpperCase()}
              </Badge>
              <span className="text-xl">
                {damageClassIcons[move.damage_class.name]}
              </span>
            </div>
            <CardTitle className="text-lg capitalize">
              {move.name.replace(/-/g, ' ')}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {effectText}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {move.power && (
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{move.power}</span>
                </div>
              )}
              
              {move.accuracy && (
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{move.accuracy}%</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-xs">PP:</span>
                <span className="font-semibold">{move.pp}</span>
              </div>
            </div>
            
            {move.priority !== 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                <ArrowUp className="w-3 h-3" />
                <span>Priority: {move.priority}</span>
              </div>
            )}
            
            {showLearnedBy && move.learned_by_pokemon.length > 0 && (
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                Learned by {move.learned_by_pokemon.length} Pokémon
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

