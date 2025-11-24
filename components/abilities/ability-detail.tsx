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
      className=&quot;space-y-6&quot;
    >
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className=&quot;flex items-center justify-between mb-4&quot;>
            <div className=&quot;flex items-center gap-3&quot;>
              <Sparkles className=&quot;w-8 h-8 text-purple-500&quot; />
              <div>
                {ability.generation && (
                  <Badge variant=&quot;secondary&quot; className=&quot;mb-2&quot;>
                    {ability.generation.name.replace('generation-', 'Generation ').toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
            {ability.is_main_series && (
              <Badge>Main Series</Badge>
            )}
          </div>
          
          <CardTitle className=&quot;text-3xl capitalize&quot;>
            {displayName}
          </CardTitle>
          
          {shortEffect && (
            <CardDescription className=&quot;text-base mt-2&quot;>
              {shortEffect}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
      
      {/* Effect Card */}
      <Card>
        <CardHeader>
          <div className=&quot;flex items-center gap-2&quot;>
            <BookOpen className=&quot;w-5 h-5&quot; />
            <CardTitle className=&quot;text-xl&quot;>Effect</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className=&quot;text-sm leading-relaxed text-gray-700 dark:text-gray-300&quot;>
            {effectText}
          </p>
        </CardContent>
      </Card>
      
      {/* Flavor Text */}
      {flavorText && (
        <Card>
          <CardHeader>
            <div className=&quot;flex items-center gap-2&quot;>
              <Info className=&quot;w-5 h-5&quot; />
              <CardTitle className=&quot;text-xl&quot;>Description</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className=&quot;text-sm italic text-gray-600 dark:text-gray-400&quot;>
              &quot;{flavorText}&quot;
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Regular Pokemon */}
      <Card>
        <CardHeader>
          <div className=&quot;flex items-center justify-between&quot;>
            <div className=&quot;flex items-center gap-2&quot;>
              <Eye className=&quot;w-5 h-5&quot; />
              <CardTitle className=&quot;text-xl&quot;>Regular Ability</CardTitle>
            </div>
            <Badge variant=&quot;secondary&quot;>
              {regularPokemon.length} Pokémon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className=&quot;flex flex-wrap gap-2&quot;>
            {regularPokemon.slice(0, 50).map((p) => (
              <Badge
                key={p.pokemon.name}
                variant=&quot;outline&quot;
                className=&quot;capitalize&quot;
              >
                {p.pokemon.name.replace(/-/g, ' ')}
              </Badge>
            ))}
            {regularPokemon.length > 50 && (
              <Badge variant=&quot;secondary&quot;>
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
            <div className=&quot;flex items-center justify-between&quot;>
              <div className=&quot;flex items-center gap-2&quot;>
                <EyeOff className=&quot;w-5 h-5 text-purple-500&quot; />
                <CardTitle className=&quot;text-xl&quot;>Hidden Ability</CardTitle>
              </div>
              <Badge variant=&quot;secondary&quot; className=&quot;bg-purple-100 dark:bg-purple-900&quot;>
                {hiddenPokemon.length} Pokémon
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className=&quot;flex flex-wrap gap-2&quot;>
              {hiddenPokemon.slice(0, 50).map((p) => (
                <Badge
                  key={p.pokemon.name}
                  variant=&quot;outline&quot;
                  className=&quot;capitalize border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300&quot;
                >
                  {p.pokemon.name.replace(/-/g, ' ')}
                </Badge>
              ))}
              {hiddenPokemon.length > 50 && (
                <Badge variant=&quot;secondary&quot;>
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

