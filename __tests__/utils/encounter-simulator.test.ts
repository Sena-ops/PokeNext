import { describe, it, expect } from 'vitest';
import { 
  simulateEncounters, 
  formatEncounterMethod 
} from '@/lib/utils/encounter-simulator';
import { PokemonEncounter } from '@/types/pokeapi';

describe('Encounter Simulator', () => {
  describe('simulateEncounters', () => {
    it('should simulate encounters with correct trial count', () => {
      const encounters: PokemonEncounter[] = [
        {
          location_area: { name: 'pikachu', url: '' },
          version_details: [
            {
              version: { name: 'red', url: '' },
              max_chance: 50,
              encounter_details: [
                {
                  min_level: 3,
                  max_level: 5,
                  condition_values: [],
                  chance: 50,
                  method: { name: 'walk', url: '' }
                }
              ]
            }
          ]
        },
        {
          location_area: { name: 'rattata', url: '' },
          version_details: [
            {
              version: { name: 'red', url: '' },
              max_chance: 50,
              encounter_details: [
                {
                  min_level: 2,
                  max_level: 4,
                  condition_values: [],
                  chance: 50,
                  method: { name: 'walk', url: '' }
                }
              ]
            }
          ]
        }
      ];
      
      const result = simulateEncounters(encounters, {
        trials: 1000,
        version: 'red',
        method: 'walk',
        shinyRate: 1 / 4096
      });
      
      expect(result.totalTrials).toBe(1000);
      expect(result.results.length).toBeGreaterThan(0);
      
      // Sum of all encounters should equal total trials
      const totalEncounters = result.results.reduce(
        (sum, r) => sum + r.encounters,
        0
      );
      expect(totalEncounters).toBe(1000);
    });
    
    it('should calculate probabilities correctly', () => {
      const encounters: PokemonEncounter[] = [
        {
          location_area: { name: 'pikachu', url: '' },
          version_details: [
            {
              version: { name: 'red', url: '' },
              max_chance: 100,
              encounter_details: [
                {
                  min_level: 3,
                  max_level: 5,
                  condition_values: [],
                  chance: 100,
                  method: { name: 'walk', url: '' }
                }
              ]
            }
          ]
        }
      ];
      
      const result = simulateEncounters(encounters, {
        trials: 100,
        version: 'red',
        method: 'walk'
      });
      
      expect(result.results.length).toBe(1);
      expect(result.results[0].probability).toBeCloseTo(1.0, 1);
    });
    
    it('should handle empty encounters gracefully', () => {
      const result = simulateEncounters([], {
        trials: 100,
        version: 'red',
        method: 'walk'
      });
      
      expect(result.results.length).toBe(0);
      expect(result.totalTrials).toBe(100);
    });
  });
  
  describe('formatEncounterMethod', () => {
    it('should format encounter methods correctly', () => {
      expect(formatEncounterMethod('walk')).toBe('Walking');
      expect(formatEncounterMethod('old-rod')).toBe('Old Rod');
      expect(formatEncounterMethod('super-rod')).toBe('Super Rod');
      expect(formatEncounterMethod('surf')).toBe('Surfing');
    });
  });
});

