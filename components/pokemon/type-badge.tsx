import { PokemonType } from '@/types/pokemon';
import { cn } from '@/lib/utils';

const typeColors: Record<PokemonType, string> = {
  normal: 'bg-gray-400 text-gray-900',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-700 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-gray-900',
  rock: 'bg-yellow-800 text-white',
  ghost: 'bg-purple-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

interface TypeBadgeProps {
  type: PokemonType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
        typeColors[type],
        className
      )}
    >
      {type}
    </span>
  );
}

