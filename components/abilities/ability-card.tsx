'use client';

import { Ability } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Users } from 'lucide-react';

interface AbilityCardProps {
  ability: Ability;
}

export function AbilityCard({ ability }: AbilityCardProps) {
  const effectText = ability.effect_entries.find(e => e.language.name === 'en')?.short_effect || 
                     'No description available';
  
  const displayName = ability.names.find(n => n.language.name === 'en')?.name || 
                      ability.name.replace(/-/g, ' ');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/abilities/${ability.name}`}>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {ability.generation && (
                <Badge variant="secondary" className="text-xs">
                  {ability.generation.name.replace('generation-', 'Gen ').toUpperCase()}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg capitalize">
              {displayName}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-3">
              {effectText}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{ability.pokemon.length} Pokémon</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

