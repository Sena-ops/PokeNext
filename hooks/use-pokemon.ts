import { useQuery } from '@tanstack/react-query';
import { getPokemon, getPokemonList, searchPokemon } from '@/lib/api/pokemon';

export function usePokemonList(limit: number = 151, offset: number = 0) {
  return useQuery({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: () => getPokemonList(limit, offset),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function usePokemon(nameOrId: string | number) {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => getPokemon(nameOrId),
    enabled: !!nameOrId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSearchPokemon(query: string) {
  return useQuery({
    queryKey: ['pokemon-search', query],
    queryFn: () => searchPokemon(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

