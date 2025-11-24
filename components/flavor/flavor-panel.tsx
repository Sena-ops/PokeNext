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
  
  // Get genus (e.g., &quot;Seed Pokémon&quot;)
  const genus = species.genera.find(g => g.language.name === 'en')?.genus || '';
  
  // Get interesting facts
  const facts = [
    species.is_legendary && 'Legendary Pokémon',
    species.is_mythical && 'Mythical Pokémon',
    species.is_baby && 'Baby Pokémon',
    species.has_gender_differences && 'Has gender differences',
  ].filter(Boolean);
  
  return (
    <div className=&quot;space-y-6&quot;>
      {/* Header Info */}
      <Card>
        <CardHeader>
          <div className=&quot;flex items-center justify-between&quot;>
            <div className=&quot;flex items-center gap-2&quot;>
              <Sparkles className=&quot;w-6 h-6 text-purple-500&quot; />
              <CardTitle className=&quot;text-2xl&quot;>Lore & Information</CardTitle>
            </div>
            {genus && (
              <Badge variant=&quot;secondary&quot; className=&quot;text-sm&quot;>
                {genus}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {facts.length > 0 && (
            <div className=&quot;flex flex-wrap gap-2&quot;>
              {facts.map((fact, index) => (
                <Badge key={index} className=&quot;bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200&quot;>
                  ✨ {fact}
                </Badge>
              ))}
            </div>
          )}
          
          <div className=&quot;grid grid-cols-2 md:grid-cols-4 gap-4 mt-4&quot;>
            <StatBox label=&quot;Capture Rate&quot; value={species.capture_rate.toString()} />
            <StatBox label=&quot;Base Happiness&quot; value={species.base_happiness.toString()} />
            <StatBox label=&quot;Growth Rate&quot; value={species.growth_rate.name.replace(/-/g, ' ')} />
            <StatBox 
              label=&quot;Habitat&quot; 
              value={species.habitat?.name.replace(/-/g, ' ') || 'Unknown'} 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Flavor Texts */}
      <Card>
        <CardHeader>
          <div className=&quot;flex items-center gap-2 mb-4&quot;>
            <BookOpen className=&quot;w-6 h-6 text-blue-500&quot; />
            <CardTitle className=&quot;text-2xl&quot;>Pokédex Entries</CardTitle>
          </div>
          
          {/* Version Filter */}
          <div className=&quot;flex flex-wrap gap-2&quot;>
            <Badge
              variant={selectedVersion === null ? 'default' : 'outline'}
              className=&quot;cursor-pointer&quot;
              onClick={() => setSelectedVersion(null)}
            >
              Recent
            </Badge>
            {versions.slice(0, 10).map(version => (
              <Badge
                key={version}
                variant={selectedVersion === version ? 'default' : 'outline'}
                className=&quot;cursor-pointer capitalize&quot;
                onClick={() => setSelectedVersion(version)}
              >
                {version.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className=&quot;space-y-4&quot;>
            {displayedTexts.map((entry, index) => (
              <motion.div
                key={`${entry.version}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className=&quot;p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg&quot;
              >
                <div className=&quot;flex items-start gap-3&quot;>
                  <Badge variant=&quot;secondary&quot; className=&quot;mt-1 capitalize shrink-0&quot;>
                    {entry.version.replace(/-/g, ' ')}
                  </Badge>
                  <p className=&quot;text-sm text-gray-700 dark:text-gray-300 italic&quot;>
                    &quot;{entry.text}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {flavorTexts.length > displayedTexts.length && !selectedVersion && (
            <p className=&quot;text-sm text-gray-500 dark:text-gray-400 mt-4 text-center&quot;>
              {flavorTexts.length - displayedTexts.length} more entries available. Select a version to filter.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Form Descriptions */}
      {species.form_descriptions.length > 0 && (
        <Card>
          <CardHeader>
            <div className=&quot;flex items-center gap-2&quot;>
              <Info className=&quot;w-6 h-6 text-green-500&quot; />
              <CardTitle className=&quot;text-xl&quot;>Form Descriptions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className=&quot;space-y-3&quot;>
              {species.form_descriptions
                .filter(desc => desc.language.name === 'en')
                .map((desc, index) => (
                  <p key={index} className=&quot;text-sm text-gray-600 dark:text-gray-400&quot;>
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
    <div className=&quot;p-3 bg-gray-50 dark:bg-gray-800 rounded-lg&quot;>
      <p className=&quot;text-xs text-gray-600 dark:text-gray-400 mb-1&quot;>{label}</p>
      <p className=&quot;font-semibold capitalize&quot;>{value}</p>
    </div>
  );
}

