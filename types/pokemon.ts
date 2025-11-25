export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny?: string | null;
    back_default?: string | null;
    back_shiny?: string | null;
    front_female?: string | null;
    front_shiny_female?: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
      showdown?: {
        front_default?: string;
        front_shiny?: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: PokemonType;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  height: number;
  weight: number;
}

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface TeamPokemon extends Pokemon {
  position: number;
}

export interface Team {
  id: string;
  name: string;
  pokemon: (TeamPokemon | null)[];
  createdAt: string;
  updatedAt: string;
}

export interface TypeEffectiveness {
  [key: string]: {
    double_damage_to: string[];
    double_damage_from: string[];
    half_damage_to: string[];
    half_damage_from: string[];
    no_damage_to: string[];
    no_damage_from: string[];
  };
}

export interface TeamAnalysis {
  synergyScore: number;
  offensiveCoverage: Record<PokemonType, number>;
  defensiveWeaknesses: Record<PokemonType, number>;
  criticalWeaknesses: PokemonType[];
  suggestions: PokemonSuggestion[];
  averageStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

export interface PokemonSuggestion {
  pokemon: Pokemon;
  reason: string;
  score: number;
}

