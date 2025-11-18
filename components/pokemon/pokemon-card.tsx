"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import { TypeBadge } from './type-badge';
import { Card } from '@/components/ui/card';
import { cn, formatPokemonName } from '@/lib/utils';
import { X } from 'lucide-react';

interface PokemonCardProps {
  pokemon: Pokemon;
  onRemove?: () => void;
  className?: string;
  compact?: boolean;
}

export const PokemonCard = memo(function PokemonCard({ pokemon, onRemove, className, compact = false }: PokemonCardProps) {
  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn('relative', className)}
    >
      <Card className="glass overflow-hidden relative group h-full">
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            aria-label="Remover Pokémon"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-4">
          <div className="flex justify-center mb-3">
            <div className="relative w-24 h-24">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                className="object-contain"
                loading="lazy"
                sizes="96px"
              />
            </div>
          </div>

          <div className="text-center mb-2">
            <h3 className="font-bold text-lg capitalize">
              {formatPokemonName(pokemon.name)}
            </h3>
            <p className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</p>
          </div>

          <div className="flex gap-2 justify-center mb-3">
            {pokemon.types.map((type) => (
              <TypeBadge key={type.slot} type={type.type.name} />
            ))}
          </div>

          {!compact && (
            <div className="space-y-1">
              {pokemon.stats.slice(0, 3).map((stat) => (
                <div key={stat.stat.name} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground capitalize w-20">
                    {stat.stat.name}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-pokemon-red h-2 rounded-full transition-all"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-8 text-right">
                    {stat.base_stat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
});

