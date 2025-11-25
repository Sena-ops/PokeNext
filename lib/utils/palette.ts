/**
 * Color palette extraction from Pokemon sprites
 * Provides utilities to extract dominant colors from Pokemon images
 */

import { Pokemon, PokemonType } from '@/types/pokemon';
import { TYPE_COLORS } from '@/lib/constants/pokemon-types';

/**
 * Extract a simple palette based on Pokemon types
 * In a real implementation, you could use canvas to extract colors from sprite
 */
export function getPokemonPalette(pokemon: Pokemon): string[] {
  const types = pokemon.types.map(t => t.type.name as PokemonType);
  const colors = types.map(type => TYPE_COLORS[type].bg);
  
  // Return unique colors
  return Array.from(new Set(colors));
}

/**
 * Get a gradient string for Pokemon based on its types
 */
export function getPokemonGradient(pokemon: Pokemon): string {
  const palette = getPokemonPalette(pokemon);
  
  if (palette.length === 1) {
    return palette[0];
  }
  
  return `linear-gradient(135deg, ${palette[0]} 0%, ${palette[palette.length - 1]} 100%)`;
}

/**
 * Get contrasting text color for a background color
 */
export function getContrastColor(hexColor: string): 'black' | 'white' {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Lighten or darken a hex color
 */
export function adjustColorBrightness(hexColor: string, percent: number): string {
  const hex = hexColor.replace('#', '');
  const num = parseInt(hex, 16);
  
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

