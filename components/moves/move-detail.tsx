'use client';

import { Move } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TYPE_COLORS } from '@/lib/constants/pokemon-types';
import { PokemonType } from '@/types/pokemon';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  ArrowUp, 
  Info, 
  Users, 
  BookOpen,
  Cpu
} from 'lucide-react';

interface MoveDetailProps {
  move: Move;
}

export function MoveDetail({ move }: MoveDetailProps) {
  const typeName = move.type.name as PokemonType;
  const typeColor = TYPE_COLORS[typeName]?.bg || '#A8A878';
  
  const damageClassIcons = {
    physical: '⚔️',
    special: '✨',
    status: '🛡️'
  };
  
  const effectText = move.effect_entries.find(e => e.language.name === 'en')?.effect || 'No description available';
  const shortEffect = move.effect_entries.find(e => e.language.name === 'en')?.short_effect || '';
  
  const flavorText = move.flavor_text_entries.find(
    e => e.language.name === 'en'
  )?.flavor_text.replace(/\n/g, ' ') || '';
  
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
            <Badge
              style={{ backgroundColor: typeColor, color: TYPE_COLORS[typeName]?.text }}
              className=&quot;text-sm font-semibold px-4 py-1&quot;
            >
              {typeName.toUpperCase()}
            </Badge>
            <div className=&quot;flex items-center gap-2&quot;>
              <span className=&quot;text-2xl&quot;>{damageClassIcons[move.damage_class.name]}</span>
              <span className=&quot;text-sm text-gray-600 dark:text-gray-400 capitalize&quot;>
                {move.damage_class.name}
              </span>
            </div>
          </div>
          
          <CardTitle className=&quot;text-3xl capitalize&quot;>
            {move.name.replace(/-/g, ' ')}
          </CardTitle>
          
          {shortEffect && (
            <CardDescription className=&quot;text-base mt-2&quot;>
              {shortEffect}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          <div className=&quot;grid grid-cols-2 md:grid-cols-4 gap-4&quot;>
            <StatBox icon={<Zap />} label=&quot;Power&quot; value={move.power?.toString() || '—'} />
            <StatBox icon={<Target />} label=&quot;Accuracy&quot; value={move.accuracy ? `${move.accuracy}%` : '—'} />
            <StatBox icon={<Info />} label=&quot;PP&quot; value={move.pp.toString()} />
            <StatBox icon={<ArrowUp />} label=&quot;Priority&quot; value={move.priority.toString()} />
          </div>
        </CardContent>
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
          
          {move.effect_chance && (
            <div className=&quot;mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg&quot;>
              <p className=&quot;text-sm text-blue-900 dark:text-blue-200&quot;>
                <strong>Effect Chance:</strong> {move.effect_chance}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Flavor Text */}
      {flavorText && (
        <Card>
          <CardHeader>
            <CardTitle className=&quot;text-xl&quot;>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=&quot;text-sm italic text-gray-600 dark:text-gray-400&quot;>
              &quot;{flavorText}&quot;
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Learned By */}
      <Card>
        <CardHeader>
          <div className=&quot;flex items-center justify-between&quot;>
            <div className=&quot;flex items-center gap-2&quot;>
              <Users className=&quot;w-5 h-5&quot; />
              <CardTitle className=&quot;text-xl&quot;>Learned By</CardTitle>
            </div>
            <Badge variant=&quot;secondary&quot;>
              {move.learned_by_pokemon.length} Pokémon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className=&quot;flex flex-wrap gap-2&quot;>
            {move.learned_by_pokemon.slice(0, 50).map((pokemon) => (
              <Badge
                key={pokemon.name}
                variant=&quot;outline&quot;
                className=&quot;capitalize&quot;
              >
                {pokemon.name.replace(/-/g, ' ')}
              </Badge>
            ))}
            {move.learned_by_pokemon.length > 50 && (
              <Badge variant=&quot;secondary&quot;>
                +{move.learned_by_pokemon.length - 50} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Machines */}
      {move.machines.length > 0 && (
        <Card>
          <CardHeader>
            <div className=&quot;flex items-center gap-2&quot;>
              <Cpu className=&quot;w-5 h-5&quot; />
              <CardTitle className=&quot;text-xl&quot;>TM/HM Machines</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className=&quot;flex flex-wrap gap-2&quot;>
              {move.machines.map((machine, index) => (
                <Badge key={index} variant=&quot;outline&quot;>
                  {machine.version_group.name.toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className=&quot;p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg&quot;>
      <div className=&quot;flex items-center gap-2 mb-1 text-gray-600 dark:text-gray-400&quot;>
        <span className=&quot;w-4 h-4&quot;>{icon}</span>
        <span className=&quot;text-xs font-medium&quot;>{label}</span>
      </div>
      <p className=&quot;text-2xl font-bold&quot;>{value}</p>
    </div>
  );
}

