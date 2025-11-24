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
      className="space-y-6"
    >
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge
              style={{ backgroundColor: typeColor, color: TYPE_COLORS[typeName]?.text }}
              className="text-sm font-semibold px-4 py-1"
            >
              {typeName.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{damageClassIcons[move.damage_class.name]}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {move.damage_class.name}
              </span>
            </div>
          </div>
          
          <CardTitle className="text-3xl capitalize">
            {move.name.replace(/-/g, ' ')}
          </CardTitle>
          
          {shortEffect && (
            <CardDescription className="text-base mt-2">
              {shortEffect}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox icon={<Zap />} label="Power" value={move.power?.toString() || '—'} />
            <StatBox icon={<Target />} label="Accuracy" value={move.accuracy ? `${move.accuracy}%` : '—'} />
            <StatBox icon={<Info />} label="PP" value={move.pp.toString()} />
            <StatBox icon={<ArrowUp />} label="Priority" value={move.priority.toString()} />
          </div>
        </CardContent>
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
          
          {move.effect_chance && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
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
            <CardTitle className="text-xl">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              "{flavorText}"
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Learned By */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <CardTitle className="text-xl">Learned By</CardTitle>
            </div>
            <Badge variant="secondary">
              {move.learned_by_pokemon.length} Pokémon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {move.learned_by_pokemon.slice(0, 50).map((pokemon) => (
              <Badge
                key={pokemon.name}
                variant="outline"
                className="capitalize"
              >
                {pokemon.name.replace(/-/g, ' ')}
              </Badge>
            ))}
            {move.learned_by_pokemon.length > 50 && (
              <Badge variant="secondary">
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
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              <CardTitle className="text-xl">TM/HM Machines</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {move.machines.map((machine, index) => (
                <Badge key={index} variant="outline">
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
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      <div className="flex items-center gap-2 mb-1 text-gray-600 dark:text-gray-400">
        <span className="w-4 h-4">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

