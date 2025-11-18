import { PokemonType } from '@/types/pokemon';

export const POKEMON_TYPES: PokemonType[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string }> = {
  normal: { bg: '#A8A878', text: '#000000' },
  fire: { bg: '#F08030', text: '#FFFFFF' },
  water: { bg: '#6890F0', text: '#FFFFFF' },
  electric: { bg: '#F8D030', text: '#000000' },
  grass: { bg: '#78C850', text: '#000000' },
  ice: { bg: '#98D8D8', text: '#000000' },
  fighting: { bg: '#C03028', text: '#FFFFFF' },
  poison: { bg: '#A040A0', text: '#FFFFFF' },
  ground: { bg: '#E0C068', text: '#000000' },
  flying: { bg: '#A890F0', text: '#000000' },
  psychic: { bg: '#F85888', text: '#FFFFFF' },
  bug: { bg: '#A8B820', text: '#000000' },
  rock: { bg: '#B8A038', text: '#FFFFFF' },
  ghost: { bg: '#705898', text: '#FFFFFF' },
  dragon: { bg: '#7038F8', text: '#FFFFFF' },
  dark: { bg: '#705848', text: '#FFFFFF' },
  steel: { bg: '#B8B8D0', text: '#000000' },
  fairy: { bg: '#EE99AC', text: '#000000' },
};

