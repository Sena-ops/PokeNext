import { describe, it, expect } from 'vitest';
import { 
  calculatePokemonRoles,
  getMissingCoverage,
  calculateTeamBalance,
  generateTeamSuggestions 
} from '@/lib/utils/team-suggest';
import { Pokemon } from '@/types/pokemon';

describe('Team Suggestion Utils', () => {
  describe('calculatePokemonRoles', () => {
    it('should identify sweeper role for high attack/speed pokemon', () => {
      const pokemon = {
        stats: [
          { base_stat: 45, stat: { name: 'hp' } },
          { base_stat: 120, stat: { name: 'attack' } },
          { base_stat: 50, stat: { name: 'defense' } },
          { base_stat: 60, stat: { name: 'special-attack' } },
          { base_stat: 50, stat: { name: 'special-defense' } },
          { base_stat: 110, stat: { name: 'speed' } }
        ]
      } as Pokemon;
      
      const roles = calculatePokemonRoles(pokemon);
      
      expect(roles[0].role).toBe('sweeper');
    });
    
    it('should identify tank role for high HP/defense pokemon', () => {
      const pokemon = {
        stats: [
          { base_stat: 120, stat: { name: 'hp' } },
          { base_stat: 50, stat: { name: 'attack' } },
          { base_stat: 100, stat: { name: 'defense' } },
          { base_stat: 60, stat: { name: 'special-attack' } },
          { base_stat: 100, stat: { name: 'special-defense' } },
          { base_stat: 30, stat: { name: 'speed' } }
        ]
      } as Pokemon;
      
      const roles = calculatePokemonRoles(pokemon);
      
      const tankRole = roles.find(r => r.role === 'tank');
      expect(tankRole).toBeDefined();
      expect(tankRole!.score).toBeGreaterThan(50);
    });
  });
  
  describe('getMissingCoverage', () => {
    it('should identify missing types in team', () => {
      const team: Pokemon[] = [
        {
          types: [
            { slot: 1, type: { name: 'fire', url: '' } }
          ]
        } as Pokemon,
        {
          types: [
            { slot: 1, type: { name: 'water', url: '' } }
          ]
        } as Pokemon
      ];
      
      const missing = getMissingCoverage(team);
      
      expect(missing).not.toContain('fire');
      expect(missing).not.toContain('water');
      expect(missing).toContain('electric');
      expect(missing).toContain('grass');
    });
    
    it('should return all types for empty team', () => {
      const missing = getMissingCoverage([]);
      
      expect(missing.length).toBe(18);
    });
  });
  
  describe('calculateTeamBalance', () => {
    it('should return 0 for empty team', () => {
      const balance = calculateTeamBalance([]);
      expect(balance).toBe(0);
    });
    
    it('should calculate balance for team', () => {
      const team: Pokemon[] = [
        {
          stats: [
            { base_stat: 80, stat: { name: 'hp' } },
            { base_stat: 80, stat: { name: 'attack' } },
            { base_stat: 80, stat: { name: 'defense' } },
            { base_stat: 80, stat: { name: 'special-attack' } },
            { base_stat: 80, stat: { name: 'special-defense' } },
            { base_stat: 80, stat: { name: 'speed' } }
          ]
        } as Pokemon
      ];
      
      const balance = calculateTeamBalance(team);
      
      expect(balance).toBeGreaterThan(50);
    });
  });
  
  describe('generateTeamSuggestions', () => {
    it('should generate suggestions', () => {
      const available: Pokemon[] = [
        {
          id: 1,
          name: 'pikachu',
          types: [{ slot: 1, type: { name: 'electric', url: '' } }],
          stats: [
            { base_stat: 35, stat: { name: 'hp' } },
            { base_stat: 55, stat: { name: 'attack' } },
            { base_stat: 40, stat: { name: 'defense' } },
            { base_stat: 50, stat: { name: 'special-attack' } },
            { base_stat: 50, stat: { name: 'special-defense' } },
            { base_stat: 90, stat: { name: 'speed' } }
          ]
        } as Pokemon,
        {
          id: 2,
          name: 'charmander',
          types: [{ slot: 1, type: { name: 'fire', url: '' } }],
          stats: [
            { base_stat: 39, stat: { name: 'hp' } },
            { base_stat: 52, stat: { name: 'attack' } },
            { base_stat: 43, stat: { name: 'defense' } },
            { base_stat: 60, stat: { name: 'special-attack' } },
            { base_stat: 50, stat: { name: 'special-defense' } },
            { base_stat: 65, stat: { name: 'speed' } }
          ]
        } as Pokemon
      ];
      
      const suggestions = generateTeamSuggestions(available, [], 2);
      
      expect(suggestions.length).toBeLessThanOrEqual(2);
      expect(suggestions[0]).toHaveProperty('pokemon');
      expect(suggestions[0]).toHaveProperty('role');
      expect(suggestions[0]).toHaveProperty('score');
      expect(suggestions[0]).toHaveProperty('justification');
    });
  });
});

