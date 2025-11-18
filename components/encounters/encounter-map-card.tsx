'use client';

import { PokemonEncounter } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

interface EncounterMapCardProps {
  encounter: PokemonEncounter;
  version?: string;
}

export function EncounterMapCard({ encounter, version = 'red' }: EncounterMapCardProps) {
  const locationName = encounter.location_area.name.replace(/-/g, ' ');
  
  const versionData = encounter.version_details.find(
    vd => vd.version.name === version
  ) || encounter.version_details[0];
  
  if (!versionData) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <CardTitle className="text-lg capitalize">{locationName}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {versionData.encounter_details.map((detail, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {detail.method.name.replace(/-/g, ' ')}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Percent className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{detail.chance}%</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span>Levels: </span>
                <span className="font-semibold">
                  {detail.min_level}
                  {detail.min_level !== detail.max_level && ` - ${detail.max_level}`}
                </span>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Max Chance:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {versionData.max_chance}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

