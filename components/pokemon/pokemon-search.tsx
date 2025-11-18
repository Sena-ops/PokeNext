"use client";

import { useState, useCallback, memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchPokemon } from '@/hooks/use-pokemon';
import { Pokemon } from '@/types/pokemon';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { formatPokemonName } from '@/lib/utils';

interface PokemonSearchProps {
  onSelect: (pokemon: Pokemon) => void;
}

// Componente memoizado para item de resultado
const SearchResultItem = memo(({ pokemon, onSelect }: { pokemon: Pokemon; onSelect: (p: Pokemon) => void }) => (
  <button
    onClick={() => onSelect(pokemon)}
    className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
  >
    <div className="relative w-12 h-12 flex-shrink-0">
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        fill
        className="object-contain"
        loading="lazy"
        sizes="48px"
      />
    </div>
    <div className="flex-1 text-left">
      <p className="font-semibold capitalize">
        {formatPokemonName(pokemon.name)}
      </p>
      <p className="text-sm text-muted-foreground">
        #{pokemon.id.toString().padStart(3, '0')}
      </p>
    </div>
    <div className="flex gap-1">
      {pokemon.types.map((type) => (
        <span
          key={type.slot}
          className={`type-${type.type.name} px-2 py-1 rounded text-xs text-white uppercase font-bold`}
        >
          {type.type.name}
        </span>
      ))}
    </div>
  </button>
));

SearchResultItem.displayName = 'SearchResultItem';

export function PokemonSearch({ onSelect }: PokemonSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Usa hook de debounce otimizado
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useSearchPokemon(debouncedQuery);

  const handleSelect = useCallback((pokemon: Pokemon) => {
    onSelect(pokemon);
    setQuery('');
    setIsOpen(false);
  }, [onSelect]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar Pokémon..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {isOpen && debouncedQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 glass rounded-lg shadow-xl max-h-96 overflow-y-auto"
          >
            {isLoading && (
              <div className="p-4 text-center text-muted-foreground">
                Buscando...
              </div>
            )}

            {!isLoading && results && results.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum Pokémon encontrado
              </div>
            )}

            {!isLoading && results && results.length > 0 && (
              <div className="p-2">
                {results.map((pokemon) => (
                  <SearchResultItem
                    key={pokemon.id}
                    pokemon={pokemon}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

