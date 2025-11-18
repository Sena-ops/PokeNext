import { Pokemon, PokemonListResponse } from '@/types/pokemon';
import {
  Move,
  MoveListResponse,
  Ability,
  AbilityListResponse,
  PokemonEncounter,
  EvolutionChain,
  EggGroup,
  PokemonSpecies,
  Generation,
  VersionGroup,
  Type,
  LocationArea,
} from '@/types/pokeapi';

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

// ============= MOVES API =============

/**
 * Get a list of moves with pagination
 * @param limit Number of moves to return (default: 20)
 * @param offset Pagination offset (default: 0)
 */
export async function listMoves(limit: number = 20, offset: number = 0): Promise<MoveListResponse> {
  const response = await fetch(`${BASE_URL}/move?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 } // Cache por 1 hora
  });
  if (!response.ok) {
    throw new Error('Failed to fetch moves list');
  }
  return response.json();
}

/**
 * Get detailed information about a specific move
 * @param nameOrId Move name or ID
 */
export async function getMove(nameOrId: string | number): Promise<Move> {
  const response = await fetch(`${BASE_URL}/move/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch move: ${nameOrId}`);
  }
  return response.json();
}

// ============= ABILITIES API =============

/**
 * Get a list of abilities with pagination
 * @param limit Number of abilities to return (default: 20)
 * @param offset Pagination offset (default: 0)
 */
export async function listAbilities(limit: number = 20, offset: number = 0): Promise<AbilityListResponse> {
  const response = await fetch(`${BASE_URL}/ability?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch abilities list');
  }
  return response.json();
}

/**
 * Get detailed information about a specific ability
 * @param nameOrId Ability name or ID
 */
export async function getAbility(nameOrId: string | number): Promise<Ability> {
  const response = await fetch(`${BASE_URL}/ability/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ability: ${nameOrId}`);
  }
  return response.json();
}

// ============= ENCOUNTERS API =============

/**
 * Get encounter locations for a specific Pokémon
 * @param nameOrId Pokemon name or ID
 */
export async function getPokemonEncounters(nameOrId: string | number): Promise<PokemonEncounter[]> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}/encounters`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch encounters for: ${nameOrId}`);
  }
  return response.json();
}

/**
 * Get detailed information about a location area
 * @param nameOrId Location area name or ID
 */
export async function getLocationArea(nameOrId: string | number): Promise<LocationArea> {
  const response = await fetch(`${BASE_URL}/location-area/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch location area: ${nameOrId}`);
  }
  return response.json();
}

// ============= EVOLUTION API =============

/**
 * Get evolution chain by ID
 * @param chainId Evolution chain ID
 */
export async function getEvolutionChain(chainId: number): Promise<EvolutionChain> {
  const response = await fetch(`${BASE_URL}/evolution-chain/${chainId}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${chainId}`);
  }
  return response.json();
}

// ============= BREEDING API =============

/**
 * Get egg group information
 * @param nameOrId Egg group name or ID
 */
export async function getEggGroup(nameOrId: string | number): Promise<EggGroup> {
  const response = await fetch(`${BASE_URL}/egg-group/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch egg group: ${nameOrId}`);
  }
  return response.json();
}

/**
 * Get Pokemon species (includes egg groups, evolution chain URL, flavor text)
 * @param nameOrId Pokemon species name or ID
 */
export async function getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon species: ${nameOrId}`);
  }
  return response.json();
}

// ============= GENERATION & VERSION API =============

/**
 * List all generations
 */
export async function listGenerations(): Promise<{ count: number; results: { name: string; url: string }[] }> {
  const response = await fetch(`${BASE_URL}/generation`, {
    next: { revalidate: 86400 } // Cache por 24 horas
  });
  if (!response.ok) {
    throw new Error('Failed to fetch generations');
  }
  return response.json();
}

/**
 * Get generation details
 * @param nameOrId Generation name or ID
 */
export async function getGeneration(nameOrId: string | number): Promise<Generation> {
  const response = await fetch(`${BASE_URL}/generation/${nameOrId}`, {
    next: { revalidate: 86400 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch generation: ${nameOrId}`);
  }
  return response.json();
}

/**
 * Get version group details
 * @param nameOrId Version group name or ID
 */
export async function getVersionGroup(nameOrId: string | number): Promise<VersionGroup> {
  const response = await fetch(`${BASE_URL}/version-group/${nameOrId}`, {
    next: { revalidate: 86400 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch version group: ${nameOrId}`);
  }
  return response.json();
}

/**
 * Get type information (includes damage relations)
 * @param nameOrId Type name or ID
 */
export async function getType(nameOrId: string | number): Promise<Type> {
  const response = await fetch(`${BASE_URL}/type/${nameOrId}`, {
    next: { revalidate: 86400 }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch type: ${nameOrId}`);
  }
  return response.json();
}

