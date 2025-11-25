'use client';

import { Ability } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  BookOpen,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface AbilityDetailProps {
  ability: Ability;
}

export function AbilityDetail({ ability }: AbilityDetailProps) {
  const effectText = ability.effect_entries.find(e => e.language.name === 'en')?.effect || 
                     'No description available';
  const shortEffect = ability.effect_entries.find(e => e.language.name === 'en')?.short_effect || '';
  
  const displayName = ability.names.find(n => n.language.name === 'en')?.name || 
                      ability.name.replace(/-/g, ' ');
  
  const flavorText = ability.flavor_text_entries.find(
    e => e.language.name === 'en'
  )?.flavor_text.replace(/\n/g, ' ') || '';
  
  // Separate regular and hidden ability Pokemon
  const regularPokemon = ability.pokemon.filter(p => !p.is_hidden);
  const hiddenPokemon = ability.pokemon.filter(p => p.is_hidden);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <div>
                {ability.generation && (
                  <Badge variant="secondary" className="mb-2">
                    {ability.generation.name.replace('generation-', 'Generation ').toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
            {ability.is_main_series && (
              <Badge>Main Series</Badge>
            )}
          </div>
          
          <CardTitle className="text-3xl capitalize">
            {displayName}
          </CardTitle>
          
          {shortEffect && (
            <CardDescription className="text-base mt-2">
              {shortEffect}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
      
      {/* Effect Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <CardTitle className="text-xl">Effect</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {effectText}
          </p>
        </CardContent>
      </Card>
      
      {/* Flavor Text */}
      {flavorText && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <CardTitle className="text-xl">Description</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              &ldquo;{flavorText}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Regular Pokemon */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <CardTitle className="text-xl">Regular Ability</CardTitle>
            </div>
            <Badge variant="secondary">
              {regularPokemon.length} Pokémon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {regularPokemon.slice(0, 50).map((p) => (
              <Badge
                key={p.pokemon.name}
                variant="outline"
                className="capitalize"
              >
                {p.pokemon.name.replace(/-/g, ' ')}
              </Badge>
            ))}
            {regularPokemon.length > 50 && (
              <Badge variant="secondary">
                +{regularPokemon.length - 50} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden Ability Pokemon */}
      {hiddenPokemon.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-purple-500" />
                <CardTitle className="text-xl">Hidden Ability</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900">
                {hiddenPokemon.length} Pokémon
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hiddenPokemon.slice(0, 50).map((p) => (
                <Badge
                  key={p.pokemon.name}
                  variant="outline"
                  className="capitalize border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"
                >
                  {p.pokemon.name.replace(/-/g, ' ')}
                </Badge>
              ))}
              {hiddenPokemon.length > 50 && (
                <Badge variant="secondary">
                  +{hiddenPokemon.length - 50} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

