/**
 * Encounter simulation utilities
 * Simulates wild Pokemon encounters based on PokeAPI data
 */

import { PokemonEncounter } from '@/types/pokeapi';

export interface EncounterSimulationConfig {
  trials: number;
  version?: string;
  method?: string;
  shinyRate?: number; // Default: 1/4096 (Gen 6+)
}

export interface EncounterResult {
  pokemonName: string;
  encounters: number;
  probability: number;
  shinyEncounters: number;
  levelRange: { min: number; max: number };
}

export interface SimulationStatistics {
  totalTrials: number;
  results: EncounterResult[];
  histogram: { [level: number]: number };
  averageLevel: number;
  shinyRate: number;
}

const DEFAULT_SHINY_RATE = 1 / 4096;

/**
 * Simulate N encounters in a location area
 * NOTE: PokeAPI doesn't provide shiny rates, so we use a configurable default
 */
export function simulateEncounters(
  encounters: PokemonEncounter[],
  config: EncounterSimulationConfig
): SimulationStatistics {
  const {
    trials,
    version = 'red',
    method = 'walk',
    shinyRate = DEFAULT_SHINY_RATE
  } = config;
  
  // Build probability table from encounters
  const encounterTable: Array<{
    pokemon: string;
    minLevel: number;
    maxLevel: number;
    chance: number;
  }> = [];
  
  encounters.forEach(enc => {
    const versionData = enc.version_details.find(
      vd => vd.version.name === version
    );
    
    if (!versionData) return;
    
    versionData.encounter_details.forEach(detail => {
      if (detail.method.name === method) {
        encounterTable.push({
          pokemon: enc.location_area.name,
          minLevel: detail.min_level,
          maxLevel: detail.max_level,
          chance: detail.chance
        });
      }
    });
  });
  
  if (encounterTable.length === 0) {
    return {
      totalTrials: trials,
      results: [],
      histogram: {},
      averageLevel: 0,
      shinyRate
    };
  }
  
  // Normalize probabilities
  const totalChance = encounterTable.reduce((sum, e) => sum + e.chance, 0);
  
  // Run simulation
  const resultMap = new Map<string, {
    count: number;
    shiny: number;
    levels: number[];
    minLevel: number;
    maxLevel: number;
  }>();
  
  const levelHistogram: { [level: number]: number } = {};
  
  for (let i = 0; i < trials; i++) {
    // Select Pokemon based on probability
    const roll = Math.random() * totalChance;
    let cumulative = 0;
    let selected = encounterTable[0];
    
    for (const entry of encounterTable) {
      cumulative += entry.chance;
      if (roll <= cumulative) {
        selected = entry;
        break;
      }
    }
    
    // Random level in range
    const level = Math.floor(
      Math.random() * (selected.maxLevel - selected.minLevel + 1)
    ) + selected.minLevel;
    
    // Check for shiny
    const isShiny = Math.random() < shinyRate;
    
    // Record result
    if (!resultMap.has(selected.pokemon)) {
      resultMap.set(selected.pokemon, {
        count: 0,
        shiny: 0,
        levels: [],
        minLevel: selected.minLevel,
        maxLevel: selected.maxLevel
      });
    }
    
    const entry = resultMap.get(selected.pokemon)!;
    entry.count++;
    if (isShiny) entry.shiny++;
    entry.levels.push(level);
    
    // Update histogram
    levelHistogram[level] = (levelHistogram[level] || 0) + 1;
  }
  
  // Calculate statistics
  const results: EncounterResult[] = Array.from(resultMap.entries()).map(
    ([pokemon, data]) => ({
      pokemonName: pokemon,
      encounters: data.count,
      probability: data.count / trials,
      shinyEncounters: data.shiny,
      levelRange: { min: data.minLevel, max: data.maxLevel }
    })
  );
  
  const totalLevels = Array.from(resultMap.values()).flatMap(d => d.levels);
  const averageLevel = totalLevels.reduce((a, b) => a + b, 0) / totalLevels.length;
  
  return {
    totalTrials: trials,
    results: results.sort((a, b) => b.encounters - a.encounters),
    histogram: levelHistogram,
    averageLevel: Math.round(averageLevel * 10) / 10,
    shinyRate
  };
}

/**
 * Format encounter method for display
 */
export function formatEncounterMethod(method: string): string {
  const methodNames: { [key: string]: string } = {
    walk: 'Walking',
    'old-rod': 'Old Rod',
    'good-rod': 'Good Rod',
    'super-rod': 'Super Rod',
    surf: 'Surfing',
    'rock-smash': 'Rock Smash',
    headbutt: 'Headbutt',
    'dark-grass': 'Dark Grass',
    'grass-spots': 'Grass Spots',
    'cave-spots': 'Cave Spots',
    'bridge-spots': 'Bridge Spots',
    'super-rod-spots': 'Super Rod Spots',
    'surf-spots': 'Surf Spots',
    'yellow-flowers': 'Yellow Flowers',
    'purple-flowers': 'Purple Flowers',
    'red-flowers': 'Red Flowers',
    'rough-terrain': 'Rough Terrain'
  };
  
  return methodNames[method] || method.split('-').map(
    w => w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

