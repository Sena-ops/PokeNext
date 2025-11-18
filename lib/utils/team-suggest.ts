/**
 * Auto Team Suggestion System
 * Suggests Pokemon based on role analysis, type coverage, and team balance
 */

import { Pokemon, PokemonType } from '@/types/pokemon';
import { POKEMON_TYPES } from '@/lib/constants/pokemon-types';

export type PokemonRole = 'sweeper' | 'tank' | 'support' | 'balanced' | 'wall' | 'special-attacker';

export interface RoleScore {
  role: PokemonRole;
  score: number;
  description: string;
}

export interface PokemonSuggestion {
  pokemon: Pokemon;
  role: PokemonRole;
  score: number;
  justification: string;
  coverageTypes: PokemonType[];
}

/**
 * Calculate role scores for a Pokemon based on base stats
 */
export function calculatePokemonRoles(pokemon: Pokemon): RoleScore[] {
  const stats = {
    hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
    attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
    spAttack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
    spDefense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
  };
  
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const average = total / 6;
  
  const roles: RoleScore[] = [];
  
  // Physical Sweeper: High Attack + Speed
  const sweeperScore = (stats.attack * 0.4 + stats.speed * 0.4 + stats.hp * 0.2) / 5;
  roles.push({
    role: 'sweeper',
    score: sweeperScore,
    description: 'High attack and speed for quick knockouts'
  });
  
  // Special Attacker: High Sp. Attack + Speed
  const specialAttackerScore = (stats.spAttack * 0.4 + stats.speed * 0.4 + stats.hp * 0.2) / 5;
  roles.push({
    role: 'special-attacker',
    score: specialAttackerScore,
    description: 'Powerful special moves with good speed'
  });
  
  // Tank: High HP + Defense + Sp. Defense
  const tankScore = (stats.hp * 0.4 + stats.defense * 0.3 + stats.spDefense * 0.3) / 5;
  roles.push({
    role: 'tank',
    score: tankScore,
    description: 'Absorbs damage with high HP and defenses'
  });
  
  // Physical Wall: High Defense + HP
  const wallScore = (stats.defense * 0.5 + stats.hp * 0.3 + stats.spDefense * 0.2) / 5;
  roles.push({
    role: 'wall',
    score: wallScore,
    description: 'Excellent physical defense'
  });
  
  // Balanced: Even stats
  const variance = Object.values(stats).reduce((sum, stat) => {
    return sum + Math.pow(stat - average, 2);
  }, 0) / 6;
  const balancedScore = 100 - Math.sqrt(variance) / 2;
  roles.push({
    role: 'balanced',
    score: balancedScore,
    description: 'Well-rounded stats for versatility'
  });
  
  return roles.sort((a, b) => b.score - a.score);
}

/**
 * Get type coverage score for a Pokemon
 * Higher score = more types it can hit super-effectively
 */
export function getTypeCoverageScore(pokemonTypes: PokemonType[]): number {
  // Simplified: just count unique offensive advantages
  // In a full implementation, would fetch actual type effectiveness data
  return pokemonTypes.length * 10; // Placeholder
}

/**
 * Check if team needs a specific type for better coverage
 */
export function getMissingCoverage(team: Pokemon[]): PokemonType[] {
  const teamTypes = new Set<PokemonType>();
  
  team.forEach(pokemon => {
    pokemon.types.forEach(t => {
      teamTypes.add(t.type.name as PokemonType);
    });
  });
  
  // Find types not represented in team
  const missing = POKEMON_TYPES.filter(type => !teamTypes.has(type));
  
  return missing;
}

/**
 * Calculate team balance score (0-100)
 * Higher = more balanced stats across team
 */
export function calculateTeamBalance(team: Pokemon[]): number {
  if (team.length === 0) return 0;
  
  const avgStats = {
    attack: 0,
    defense: 0,
    spAttack: 0,
    spDefense: 0,
    speed: 0,
    hp: 0
  };
  
  team.forEach(pokemon => {
    avgStats.attack += pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
    avgStats.defense += pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
    avgStats.spAttack += pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
    avgStats.spDefense += pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0;
    avgStats.speed += pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0;
    avgStats.hp += pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
  });
  
  Object.keys(avgStats).forEach(key => {
    avgStats[key as keyof typeof avgStats] /= team.length;
  });
  
  // Calculate variance - lower variance = more balanced
  const values = Object.values(avgStats);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  // Normalize to 0-100 scale (lower variance = higher score)
  const balanceScore = Math.max(0, 100 - Math.sqrt(variance) / 2);
  
  return Math.round(balanceScore);
}

/**
 * Generate Pokemon suggestions for team
 * @param availablePokemon Pool of Pokemon to suggest from
 * @param currentTeam Current team members
 * @param count Number of suggestions (default: 6)
 */
export function generateTeamSuggestions(
  availablePokemon: Pokemon[],
  currentTeam: Pokemon[],
  count: number = 6
): PokemonSuggestion[] {
  const suggestions: PokemonSuggestion[] = [];
  
  // Get missing type coverage
  const missingTypes = getMissingCoverage(currentTeam);
  
  // Score each available Pokemon
  availablePokemon.forEach(pokemon => {
    // Skip if already in team
    if (currentTeam.some(p => p.id === pokemon.id)) {
      return;
    }
    
    const roles = calculatePokemonRoles(pokemon);
    const primaryRole = roles[0];
    
    const pokemonTypes = pokemon.types.map(t => t.type.name as PokemonType);
    
    // Bonus for covering missing types
    const coverageBonus = pokemonTypes.filter(type => 
      missingTypes.includes(type)
    ).length * 15;
    
    // Base score from role
    let score = primaryRole.score + coverageBonus;
    
    // Bonus for legendary/mythical (simple heuristic based on stats)
    const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
    if (totalStats > 580) {
      score += 10;
    }
    
    // Build justification
    const justificationParts: string[] = [];
    justificationParts.push(`${primaryRole.description}`);
    
    if (coverageBonus > 0) {
      const coveredTypes = pokemonTypes.filter(t => missingTypes.includes(t));
      justificationParts.push(`Adds ${coveredTypes.join(', ')} coverage`);
    }
    
    suggestions.push({
      pokemon,
      role: primaryRole.role,
      score,
      justification: justificationParts.join('. '),
      coverageTypes: pokemonTypes
    });
  });
  
  // Sort by score and return top N
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

