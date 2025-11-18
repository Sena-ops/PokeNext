import { describe, it, expect } from 'vitest';
import { 
  getPokemonPalette, 
  getPokemonGradient,
  getContrastColor,
  adjustColorBrightness 
} from '@/lib/utils/palette';
import { Pokemon } from '@/types/pokemon';

describe('Palette Utils', () => {
  describe('getPokemonPalette', () => {
    it('should extract colors from single-type pokemon', () => {
      const pokemon = {
        types: [
          { slot: 1, type: { name: 'fire', url: '' } }
        ]
      } as Pokemon;
      
      const palette = getPokemonPalette(pokemon);
      
      expect(palette.length).toBe(1);
      expect(palette[0]).toBe('#F08030');
    });
    
    it('should extract colors from dual-type pokemon', () => {
      const pokemon = {
        types: [
          { slot: 1, type: { name: 'fire', url: '' } },
          { slot: 2, type: { name: 'flying', url: '' } }
        ]
      } as Pokemon;
      
      const palette = getPokemonPalette(pokemon);
      
      expect(palette.length).toBe(2);
      expect(palette).toContain('#F08030');
      expect(palette).toContain('#A890F0');
    });
  });
  
  describe('getPokemonGradient', () => {
    it('should return solid color for single-type pokemon', () => {
      const pokemon = {
        types: [
          { slot: 1, type: { name: 'water', url: '' } }
        ]
      } as Pokemon;
      
      const gradient = getPokemonGradient(pokemon);
      
      expect(gradient).toBe('#6890F0');
    });
    
    it('should return gradient for dual-type pokemon', () => {
      const pokemon = {
        types: [
          { slot: 1, type: { name: 'grass', url: '' } },
          { slot: 2, type: { name: 'poison', url: '' } }
        ]
      } as Pokemon;
      
      const gradient = getPokemonGradient(pokemon);
      
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#78C850');
      expect(gradient).toContain('#A040A0');
    });
  });
  
  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#FFFFFF')).toBe('black');
      expect(getContrastColor('#FFCB05')).toBe('black');
    });
    
    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('white');
      expect(getContrastColor('#222224')).toBe('white');
    });
  });
  
  describe('adjustColorBrightness', () => {
    it('should lighten colors with positive values', () => {
      const original = '#808080';
      const lightened = adjustColorBrightness(original, 50);
      
      expect(lightened).not.toBe(original);
      expect(parseInt(lightened.slice(1), 16)).toBeGreaterThan(
        parseInt(original.slice(1), 16)
      );
    });
    
    it('should darken colors with negative values', () => {
      const original = '#808080';
      const darkened = adjustColorBrightness(original, -50);
      
      expect(darkened).not.toBe(original);
      expect(parseInt(darkened.slice(1), 16)).toBeLessThan(
        parseInt(original.slice(1), 16)
      );
    });
  });
});

