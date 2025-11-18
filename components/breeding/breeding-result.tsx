'use client';

import { PokemonSpecies } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  Heart, 
  Clock,
  Egg,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  checkBreedingCompatibility, 
  formatEggGroupName,
  getGenderRatio,
  EggMove
} from '@/lib/utils/breeding';

interface BreedingResultProps {
  parent1Species: PokemonSpecies;
  parent2Species: PokemonSpecies;
  eggMoves: EggMove[];
}

export function BreedingResult({ parent1Species, parent2Species, eggMoves }: BreedingResultProps) {
  const compatibility = checkBreedingCompatibility(parent1Species, parent2Species);
  const parent1Gender = getGenderRatio(parent1Species.gender_rate);
  const parent2Gender = getGenderRatio(parent2Species.gender_rate);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Compatibility Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Breeding Compatibility</CardTitle>
            {compatibility.compatible ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {compatibility.compatible ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    Compatible for Breeding!
                  </p>
                </div>
                {compatibility.reason && (
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {compatibility.reason}
                  </p>
                )}
              </div>
              
              {/* Shared Egg Groups */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Shared Egg Groups</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {compatibility.sharedEggGroups.map(group => (
                    <Badge key={group} variant="secondary" className="capitalize">
                      {formatEggGroupName(group)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Egg Cycles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Egg Cycles
                    </span>
                  </div>
                  <p className="text-xl font-bold">
                    {Math.max(parent1Species.hatch_counter, parent2Species.hatch_counter)}
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Egg className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Offspring
                    </span>
                  </div>
                  <p className="text-sm font-medium capitalize">
                    {parent1Species.gender_rate === -1 ? parent2Species.name : parent1Species.name}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="font-semibold text-red-800 dark:text-red-200">
                  Not Compatible
                </p>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                {compatibility.reason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Egg Moves Card */}
      {compatibility.compatible && eggMoves.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Possible Egg Moves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {eggMoves.map((move) => (
                <div
                  key={move.name}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="font-medium capitalize">
                    {move.name.replace(/-/g, ' ')}
                  </span>
                  <Badge
                    variant={move.fromParent === 'both' ? 'default' : 'secondary'}
                  >
                    {move.fromParent === 'both' ? 'Both Parents' : 
                     move.fromParent === 'parent1' ? 'Parent 1' : 'Parent 2'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Gender Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Gender Ratios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                {parent1Species.name}
              </p>
              <GenderBar genderRatio={parent1Gender} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                {parent2Species.name}
              </p>
              <GenderBar genderRatio={parent2Gender} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function GenderBar({ genderRatio }: { genderRatio: { male: number; female: number; genderless: boolean } }) {
  if (genderRatio.genderless) {
    return (
      <div className="text-center py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <span className="text-sm font-medium">Genderless</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <div className="flex h-6 rounded-lg overflow-hidden">
        <div
          className="bg-blue-500 flex items-center justify-center text-white text-xs font-semibold"
          style={{ width: `${genderRatio.male}%` }}
        >
          {genderRatio.male > 15 && `♂ ${genderRatio.male.toFixed(0)}%`}
        </div>
        <div
          className="bg-pink-500 flex items-center justify-center text-white text-xs font-semibold"
          style={{ width: `${genderRatio.female}%` }}
        >
          {genderRatio.female > 15 && `♀ ${genderRatio.female.toFixed(0)}%`}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>♂ {genderRatio.male.toFixed(1)}%</span>
        <span>♀ {genderRatio.female.toFixed(1)}%</span>
      </div>
    </div>
  );
}

