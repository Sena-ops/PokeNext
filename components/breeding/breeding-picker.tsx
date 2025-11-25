'use client';

import { useState } from 'react';
import { Pokemon } from '@/types/pokemon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchPokemon } from '@/hooks/use-pokemon';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreedingPickerProps {
  parent: Pokemon | null;
  onSelectParent: (pokemon: Pokemon) => void;
  onClear: () => void;
  label: string;
}

export function BreedingPicker({ parent, onSelectParent, onClear, label }: BreedingPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const { data: searchResults, isLoading } = useSearchPokemon(searchQuery);
  
  const handleSelect = (pokemon: Pokemon) => {
    onSelectParent(pokemon);
    setSearchQuery('');
    setShowResults(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {parent ? (
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
            >
              <img
                src={parent.sprites.other?.['official-artwork']?.front_default || parent.sprites.front_default}
                alt={parent.name}
                className="w-20 h-20"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg capitalize">
                  {parent.name.replace(/-/g, ' ')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  #{parent.id}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="pl-10"
              />
            </div>
            
            <AnimatePresence>
              {showResults && searchQuery && searchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
                >
                  {searchResults.map((pokemon) => (
                    <div
                      key={pokemon.id}
                      onClick={() => handleSelect(pokemon)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="w-12 h-12"
                      />
                      <div>
                        <p className="font-medium capitalize">
                          {pokemon.name.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500">#{pokemon.id}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

