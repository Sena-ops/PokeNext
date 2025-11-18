import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPokemonId(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
}

export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

export function getStatName(stat: string): string {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidade',
  };
  return statNames[stat] || stat;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

