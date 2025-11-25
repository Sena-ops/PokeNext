'use client';

import { PokemonSpecies } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BookOpen, Info, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface FlavorPanelProps {
  species: PokemonSpecies;
}

export function FlavorPanel({ species }: FlavorPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  
  // Get English flavor texts
  const flavorTexts = species.flavor_text_entries
    .filter(entry => entry.language.name === 'en')
    .map(entry => ({
      text: entry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' '),
      version: entry.version.name
    }));
  
  // Get unique versions
  const versions = Array.from(new Set(flavorTexts.map(f => f.version)));
  
  const displayedTexts = selectedVersion
    ? flavorTexts.filter(f => f.version === selectedVersion)
    : flavorTexts.slice(0, 5);
  
  // Get genus (e.g., "Seed Pokémon")
  const genus = species.genera.find(g => g.language.name === 'en')?.genus || '';
  
  // Get interesting facts
  const facts = [
    species.is_legendary && 'Legendary Pokémon',
    species.is_mythical && 'Mythical Pokémon',
    species.is_baby && 'Baby Pokémon',
    species.has_gender_differences && 'Has gender differences',
  ].filter(Boolean);
  
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <CardTitle className="text-2xl">Lore & Information</CardTitle>
            </div>
            {genus && (
              <Badge variant="secondary" className="text-sm">
                {genus}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {facts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {facts.map((fact, index) => (
                <Badge key={index} className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  ✨ {fact}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatBox label="Capture Rate" value={species.capture_rate.toString()} />
            <StatBox label="Base Happiness" value={species.base_happiness.toString()} />
            <StatBox label="Growth Rate" value={species.growth_rate.name.replace(/-/g, ' ')} />
            <StatBox 
              label="Habitat" 
              value={species.habitat?.name.replace(/-/g, ' ') || 'Unknown'} 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Flavor Texts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl">Pokédex Entries</CardTitle>
          </div>
          
          {/* Version Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedVersion === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedVersion(null)}
            >
              Recent
            </Badge>
            {versions.slice(0, 10).map(version => (
              <Badge
                key={version}
                variant={selectedVersion === version ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedVersion(version)}
              >
                {version.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {displayedTexts.map((entry, index) => (
              <motion.div
                key={`${entry.version}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1 capitalize shrink-0">
                    {entry.version.replace(/-/g, ' ')}
                  </Badge>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    &ldquo;{entry.text}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {flavorTexts.length > displayedTexts.length && !selectedVersion && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              {flavorTexts.length - displayedTexts.length} more entries available. Select a version to filter.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Form Descriptions */}
      {species.form_descriptions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-6 h-6 text-green-500" />
              <CardTitle className="text-xl">Form Descriptions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {species.form_descriptions
                .filter(desc => desc.language.name === 'en')
                .map((desc, index) => (
                  <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {desc.description}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-semibold capitalize">{value}</p>
    </div>
  );
}

