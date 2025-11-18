'use client';

import { PokemonSuggestion } from '@/lib/utils/team-suggest';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import { TYPE_COLORS } from '@/lib/constants/pokemon-types';
import { PokemonType } from '@/types/pokemon';

interface SuggestionCardProps {
  suggestion: PokemonSuggestion;
  onAdd?: () => void;
  index: number;
}

export function SuggestionCard({ suggestion, onAdd, index }: SuggestionCardProps) {
  const { pokemon, role, score, justification, coverageTypes } = suggestion;
  
  const roleColors: Record<string, string> = {
    sweeper: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'special-attacker': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    tank: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    wall: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    balanced: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    support: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="w-16 h-16"
              />
              <div>
                <CardTitle className="text-lg capitalize">
                  {pokemon.name.replace(/-/g, ' ')}
                </CardTitle>
                <p className="text-xs text-gray-500">#{pokemon.id}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-bold">{score.toFixed(0)}</span>
              </div>
              <Badge className={roleColors[role] || 'bg-gray-100'}>
                {role.replace(/-/g, ' ')}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {coverageTypes.map(type => (
              <Badge
                key={type}
                variant="outline"
                style={{
                  backgroundColor: TYPE_COLORS[type].bg,
                  color: TYPE_COLORS[type].text,
                  borderColor: TYPE_COLORS[type].bg
                }}
                className="text-xs capitalize"
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {justification}
          </p>
          
          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
            {pokemon.stats.slice(0, 3).map(stat => (
              <div key={stat.stat.name} className="text-center">
                <div className="text-gray-500 capitalize">
                  {stat.stat.name.replace(/-/g, ' ').substring(0, 3)}
                </div>
                <div className="font-bold">{stat.base_stat}</div>
              </div>
            ))}
          </div>
          
          {onAdd && (
            <Button onClick={onAdd} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add to Team
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

