'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPokemonList, getPokemon } from '@/lib/api/pokemon';
import { Pokemon } from '@/types/pokemon';
import { generateTeamSuggestions } from '@/lib/utils/team-suggest';
import { SuggestionCard } from '@/components/team/suggestion-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTeamStore } from '@/store/team-store';
import Link from 'next/link';

export default function TeamSuggestPage() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { currentTeam, addPokemon } = useTeamStore();
  
  // Fetch a pool of Pokemon to suggest from (Gen 1-3 for performance)
  const { data: pokemonList, isLoading: isLoadingList } = useQuery({
    queryKey: ['pokemon-pool'],
    queryFn: () => getPokemonList(386, 0), // First 386 (Gen 1-3)
    staleTime: 1000 * 60 * 60
  });
  
  const { data: pokemonPool, isLoading: isLoadingPool } = useQuery({
    queryKey: ['pokemon-pool-details', pokemonList?.results],
    queryFn: async () => {
      if (!pokemonList) return [];
      // Fetch in batches for performance
      const batch = pokemonList.results.slice(0, 151); // Gen 1 only for now
      const promises = batch.map(p => getPokemon(p.name));
      return Promise.all(promises);
    },
    enabled: !!pokemonList,
    staleTime: 1000 * 60 * 60
  });
  
  const team = currentTeam.filter(p => p !== null);
  
  const generateSuggestions = () => {
    if (!pokemonPool) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newSuggestions = generateTeamSuggestions(
        pokemonPool,
        team as any,
        6
      );
      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 500);
  };
  
  useEffect(() => {
    if (pokemonPool && suggestions.length === 0) {
      generateSuggestions();
    }
  }, [pokemonPool]);
  
  const handleAddToTeam = (pokemon: Pokemon) => {
    const emptySlot = currentTeam.findIndex(p => p === null);
    if (emptySlot !== -1) {
      addPokemon({ ...pokemon, position: emptySlot }, emptySlot);
    }
  };
  
  const isLoading = isLoadingList || isLoadingPool;
  const hasEmptySlots = currentTeam.some(p => p === null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <h1 className="text-4xl font-bold">Team Suggestions</h1>
          </div>
          <Button
            onClick={generateSuggestions}
            disabled={isLoading || isGenerating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered Pokémon suggestions based on type coverage, roles, and team balance.
        </p>
        
        {team.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Current Team:</strong> {team.map(p => p.name).join(', ')}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Suggestions will complement your existing team members.
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Suggestions Grid */}
      {isLoading || isGenerating ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.pokemon.id}
              suggestion={suggestion}
              index={index}
              onAdd={hasEmptySlots ? () => handleAddToTeam(suggestion.pokemon) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <p className="text-gray-600 dark:text-gray-400">
            No suggestions available. Try generating suggestions.
          </p>
        </div>
      )}
      
      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
      >
        <h3 className="font-semibold mb-2">How it works</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Role Analysis:</strong> Identifies sweepers, tanks, walls, and balanced Pokémon</li>
          <li>• <strong>Type Coverage:</strong> Suggests Pokémon that fill gaps in your team's type coverage</li>
          <li>• <strong>Stat Balance:</strong> Considers overall stat distribution and team composition</li>
          <li>• <strong>Rarity Bonus:</strong> Higher-stat Pokémon (like legendaries) get bonus points</li>
        </ul>
      </motion.div>
    </div>
  );
}

