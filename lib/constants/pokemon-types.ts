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

// Helper function to get type color class for Tailwind
export function getTypeColor(type: PokemonType): string {
  const colorMap: Record<PokemonType, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-600',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-600',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-400',
  };
  return colorMap[type] || 'bg-gray-400';
}

