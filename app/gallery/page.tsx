'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPokemonList, getPokemon } from '@/lib/api/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Image as ImageIcon, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GalleryIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: pokemonList, isLoading } = useQuery({
    queryKey: ['pokemon-list-gallery'],
    queryFn: () => getPokemonList(151, 0),
    staleTime: 1000 * 60 * 60
  });
  
  const filteredPokemon = pokemonList?.results.filter(p => 
    p.name.includes(searchQuery.toLowerCase())
  ).slice(0, 24) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6 flex gap-2">
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
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold">Sprite Gallery</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Selecione um Pokémon para ver todos os sprites e artwork
        </p>
      </motion.div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Pokemon Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPokemon.map((pokemon, index) => (
            <Link key={pokemon.name} href={`/gallery/${pokemon.name}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/').slice(-2, -1)[0]}.png`}
                      alt={pokemon.name}
                      className="w-full h-24 object-contain mb-2"
                    />
                    <p className="font-semibold capitalize text-sm">
                      {pokemon.name.replace(/-/g, ' ')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

