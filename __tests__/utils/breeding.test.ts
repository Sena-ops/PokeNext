import { describe, it, expect } from 'vitest';
import { 
  checkBreedingCompatibility, 
  calculateEggMoves,
  formatEggGroupName,
  getGenderRatio 
} from '@/lib/utils/breeding';
import { PokemonSpecies } from '@/types/pokeapi';

describe('Breeding Utils', () => {
  describe('checkBreedingCompatibility', () => {
    it('should return compatible for shared egg groups', () => {
      const species1 = {
        name: 'pikachu',
        egg_groups: [{ name: 'field', url: '' }, { name: 'fairy', url: '' }]
      } as PokemonSpecies;
      
      const species2 = {
        name: 'eevee',
        egg_groups: [{ name: 'field', url: '' }]
      } as PokemonSpecies;
      
      const result = checkBreedingCompatibility(species1, species2);
      
      expect(result.compatible).toBe(true);
      expect(result.sharedEggGroups).toContain('field');
    });
    
    it('should return not compatible for no shared egg groups', () => {
      const species1 = {
        name: 'pikachu',
        egg_groups: [{ name: 'field', url: '' }]
      } as PokemonSpecies;
      
      const species2 = {
        name: 'magikarp',
        egg_groups: [{ name: 'water2', url: '' }, { name: 'dragon', url: '' }]
      } as PokemonSpecies;
      
      const result = checkBreedingCompatibility(species1, species2);
      
      expect(result.compatible).toBe(false);
      expect(result.reason).toBe('No shared egg groups');
    });
    
    it('should handle Ditto special case', () => {
      const ditto = {
        name: 'ditto',
        egg_groups: [{ name: 'ditto', url: '' }]
      } as PokemonSpecies;
      
      const other = {
        name: 'pikachu',
        egg_groups: [{ name: 'field', url: '' }]
      } as PokemonSpecies;
      
      const result = checkBreedingCompatibility(ditto, other);
      
      expect(result.compatible).toBe(true);
      expect(result.sharedEggGroups).toContain('ditto');
    });
    
    it('should not allow breeding with no-eggs group', () => {
      const species1 = {
        name: 'mew',
        egg_groups: [{ name: 'no-eggs', url: '' }]
      } as PokemonSpecies;
      
      const species2 = {
        name: 'pikachu',
        egg_groups: [{ name: 'field', url: '' }]
      } as PokemonSpecies;
      
      const result = checkBreedingCompatibility(species1, species2);
      
      expect(result.compatible).toBe(false);
      expect(result.reason).toContain('No Eggs');
    });
  });
  
  describe('calculateEggMoves', () => {
    it('should identify egg moves from parents', () => {
      const parent1Moves = [
        {
          move: { name: 'volt-tackle', url: '' },
          version_group_details: [
            { move_learn_method: { name: 'egg', url: '' } }
          ]
        }
      ];
      
      const parent2Moves = [
        {
          move: { name: 'charm', url: '' },
          version_group_details: [
            { move_learn_method: { name: 'egg', url: '' } }
          ]
        }
      ];
      
      const result = calculateEggMoves(parent1Moves as any, parent2Moves as any);
      
      expect(result.length).toBe(2);
      expect(result.find(m => m.name === 'volt-tackle')).toBeDefined();
      expect(result.find(m => m.name === 'charm')).toBeDefined();
    });
  });
  
  describe('formatEggGroupName', () => {
    it('should format egg group names correctly', () => {
      expect(formatEggGroupName('water1')).toBe('Water1');
      expect(formatEggGroupName('human-like')).toBe('Human Like');
      expect(formatEggGroupName('no-eggs')).toBe('No Eggs');
    });
  });
  
  describe('getGenderRatio', () => {
    it('should calculate gender ratios correctly', () => {
      const ratio = getGenderRatio(4); // 50/50
      expect(ratio.male).toBe(50);
      expect(ratio.female).toBe(50);
      expect(ratio.genderless).toBe(false);
    });
    
    it('should handle genderless pokemon', () => {
      const ratio = getGenderRatio(-1);
      expect(ratio.genderless).toBe(true);
      expect(ratio.male).toBe(0);
      expect(ratio.female).toBe(0);
    });
    
    it('should handle always male', () => {
      const ratio = getGenderRatio(0);
      expect(ratio.male).toBe(100);
      expect(ratio.female).toBe(0);
    });
  });
});

