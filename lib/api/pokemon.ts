import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache de lista de pokémons para evitar refetch
let cachedPokemonList: PokemonListResponse | null = null;

export async function getPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 } // Cache por 1 hora
  });
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
}

export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`, {
    next: { revalidate: 3600 } // Cache por 1 hora
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
  }
  return response.json();
}

export async function searchPokemon(query: string): Promise<Pokemon[]> {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();

  // Tenta match exato primeiro
  try {
    const pokemon = await getPokemon(normalizedQuery);
    return [pokemon];
  } catch {
    // Se falhar, usa a lista cacheada para busca eficiente
    if (!cachedPokemonList) {
      cachedPokemonList = await getPokemonList(1000);
    }

    // Filtra apenas os nomes, sem fazer fetch completo ainda
    const filtered = cachedPokemonList.results
      .filter(p => p.name.includes(normalizedQuery))
      .slice(0, 10);

    // Busca detalhes apenas dos resultados filtrados
    const pokemonPromises = filtered.map(p => getPokemon(p.name));
    return Promise.all(pokemonPromises);
  }
}

export async function getTypeEffectiveness() {
  const types = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];
  
  const effectiveness: any = {};
  
  for (const type of types) {
    const response = await fetch(`${BASE_URL}/type/${type}`);
    const data = await response.json();
    
    effectiveness[type] = {
      double_damage_to: data.damage_relations.double_damage_to.map((t: any) => t.name),
      double_damage_from: data.damage_relations.double_damage_from.map((t: any) => t.name),
      half_damage_to: data.damage_relations.half_damage_to.map((t: any) => t.name),
      half_damage_from: data.damage_relations.half_damage_from.map((t: any) => t.name),
      no_damage_to: data.damage_relations.no_damage_to.map((t: any) => t.name),
      no_damage_from: data.damage_relations.no_damage_from.map((t: any) => t.name),
    };
  }
  
  return effectiveness;
}

