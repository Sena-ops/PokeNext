'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pokemon } from '@/types/pokemon';
import { getPokemon, getPokemonSpecies } from '@/lib/api/pokemon';
import { BreedingPicker } from '@/components/breeding/breeding-picker';
import { BreedingResult } from '@/components/breeding/breeding-result';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateEggMoves } from '@/lib/utils/breeding';
import Link from 'next/link';

export default function BreedingPage() {
  const [parent1, setParent1] = useState<Pokemon | null>(null);
  const [parent2, setParent2] = useState<Pokemon | null>(null);
  
  // Fetch full Pokemon data with moves for egg move calculation
  const { data: parent1Full } = useQuery({
    queryKey: ['pokemon-full', parent1?.name],
    queryFn: () => getPokemon(parent1!.name),
    enabled: !!parent1,
    staleTime: 1000 * 60 * 60
  });
  
  const { data: parent2Full } = useQuery({
    queryKey: ['pokemon-full', parent2?.name],
    queryFn: () => getPokemon(parent2!.name),
    enabled: !!parent2,
    staleTime: 1000 * 60 * 60
  });
  
  // Fetch species data for breeding info
  const { data: parent1Species } = useQuery({
    queryKey: ['pokemon-species', parent1?.name],
    queryFn: () => getPokemonSpecies(parent1!.name),
    enabled: !!parent1,
    staleTime: 1000 * 60 * 60
  });
  
  const { data: parent2Species } = useQuery({
    queryKey: ['pokemon-species', parent2?.name],
    queryFn: () => getPokemonSpecies(parent2!.name),
    enabled: !!parent2,
    staleTime: 1000 * 60 * 60
  });
  
  const handleReset = () => {
    setParent1(null);
    setParent2(null);
  };
  
  const canCalculate = parent1Species && parent2Species && parent1Full && parent2Full;
  
  const eggMoves = canCalculate
    ? calculateEggMoves(
        (parent1Full as any).moves || [],
        (parent2Full as any).moves || []
      )
    : [];
  
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
            <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            <h1 className="text-4xl font-bold">Breeding Planner</h1>
          </div>
          {(parent1 || parent2) && (
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Select two Pokémon to check breeding compatibility and see possible egg moves.
        </p>
      </motion.div>
      
      {/* Parent Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BreedingPicker
          parent={parent1}
          onSelectParent={setParent1}
          onClear={() => setParent1(null)}
          label="Parent 1"
        />
        
        <BreedingPicker
          parent={parent2}
          onSelectParent={setParent2}
          onClear={() => setParent2(null)}
          label="Parent 2"
        />
      </div>
      
      {/* Results */}
      {canCalculate && (
        <BreedingResult
          parent1Species={parent1Species}
          parent2Species={parent2Species}
          eggMoves={eggMoves}
        />
      )}
      
      {/* Instructions */}
      {!parent1 && !parent2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300 dark:text-pink-700" />
          <h3 className="text-xl font-semibold mb-2">Select Parents to Begin</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Choose two Pokémon to check if they can breed together and discover what egg moves
            their offspring might learn.
          </p>
        </motion.div>
      )}
    </div>
  );
}

