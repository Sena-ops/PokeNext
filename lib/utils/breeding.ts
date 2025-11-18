/**
 * Breeding utilities for Pokemon compatibility and egg move calculation
 */

import { EggGroup, PokemonSpecies } from '@/types/pokeapi';
import { Pokemon } from '@/types/pokemon';

export interface BreedingCompatibility {
  compatible: boolean;
  sharedEggGroups: string[];
  reason?: string;
}

/**
 * Check if two Pokemon are compatible for breeding
 * Based on egg group compatibility
 */
export function checkBreedingCompatibility(
  species1: PokemonSpecies,
  species2: PokemonSpecies
): BreedingCompatibility {
  // Ditto can breed with anything except Pokemon in "No Eggs" group
  const isDitto1 = species1.name === 'ditto';
  const isDitto2 = species2.name === 'ditto';
  
  const eggGroups1 = species1.egg_groups.map(g => g.name);
  const eggGroups2 = species2.egg_groups.map(g => g.name);
  
  // Check if either is in "No Eggs" group
  if (eggGroups1.includes('no-eggs') || eggGroups2.includes('no-eggs')) {
    return {
      compatible: false,
      sharedEggGroups: [],
      reason: 'One or both Pokemon cannot breed (No Eggs group)'
    };
  }
  
  // Ditto special case
  if (isDitto1 || isDitto2) {
    return {
      compatible: true,
      sharedEggGroups: ['ditto'],
      reason: 'Ditto can breed with any breedable Pokemon'
    };
  }
  
  // Find shared egg groups
  const sharedGroups = eggGroups1.filter(g => eggGroups2.includes(g));
  
  if (sharedGroups.length > 0) {
    return {
      compatible: true,
      sharedEggGroups: sharedGroups
    };
  }
  
  return {
    compatible: false,
    sharedEggGroups: [],
    reason: 'No shared egg groups'
  };
}

/**
 * Get egg moves that can be inherited from parents
 * Returns moves that are learned via "egg" method
 */
export interface EggMove {
  name: string;
  fromParent: 'parent1' | 'parent2' | 'both';
}

export function calculateEggMoves(
  parent1Moves: { move: { name: string }; version_group_details: any[] }[],
  parent2Moves: { move: { name: string }; version_group_details: any[] }[]
): EggMove[] {
  const eggMoves: Map<string, EggMove> = new Map();
  
  // Find egg moves from parent 1
  parent1Moves.forEach(moveData => {
    const hasEggMethod = moveData.version_group_details.some(
      vg => vg.move_learn_method.name === 'egg'
    );
    if (hasEggMethod) {
      eggMoves.set(moveData.move.name, {
        name: moveData.move.name,
        fromParent: 'parent1'
      });
    }
  });
  
  // Find egg moves from parent 2
  parent2Moves.forEach(moveData => {
    const hasEggMethod = moveData.version_group_details.some(
      vg => vg.move_learn_method.name === 'egg'
    );
    if (hasEggMethod) {
      const existing = eggMoves.get(moveData.move.name);
      if (existing) {
        existing.fromParent = 'both';
      } else {
        eggMoves.set(moveData.move.name, {
          name: moveData.move.name,
          fromParent: 'parent2'
        });
      }
    }
  });
  
  return Array.from(eggMoves.values());
}

/**
 * Format egg group name for display
 */
export function formatEggGroupName(eggGroup: string): string {
  return eggGroup
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get breeding information summary
 */
export interface BreedingSummary {
  canBreed: boolean;
  eggGroups: string[];
  eggCycles: number;
  genderRate: number; // -1 = genderless, 0 = always male, 8 = always female, 1-7 = ratio
  isBaby: boolean;
}

export function getBreedingSummary(species: PokemonSpecies): BreedingSummary {
  return {
    canBreed: !species.egg_groups.some(g => g.name === 'no-eggs'),
    eggGroups: species.egg_groups.map(g => g.name),
    eggCycles: species.hatch_counter,
    genderRate: species.gender_rate,
    isBaby: species.is_baby
  };
}

/**
 * Calculate approximate gender ratio as percentage
 */
export function getGenderRatio(genderRate: number): { male: number; female: number; genderless: boolean } {
  if (genderRate === -1) {
    return { male: 0, female: 0, genderless: true };
  }
  
  const femalePercent = (genderRate / 8) * 100;
  const malePercent = 100 - femalePercent;
  
  return {
    male: malePercent,
    female: femalePercent,
    genderless: false
  };
}

