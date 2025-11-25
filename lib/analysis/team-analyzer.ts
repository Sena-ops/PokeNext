import { Pokemon, PokemonType, TeamAnalysis, TeamPokemon } from '@/types/pokemon';

const TYPE_CHART: Record<PokemonType, { weak: PokemonType[]; resist: PokemonType[]; immune: PokemonType[] }> = {
  normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
  fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
  water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
  electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'], immune: [] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
  poison: { weak: ['ground', 'psychic'], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immune: [] },
  ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
  flying: { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
  bug: { weak: ['fire', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
  ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'electric', 'grass'], immune: [] },
  dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
  steel: { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
  fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] },
};

export function analyzeTeam(team: (TeamPokemon | null)[]): TeamAnalysis {
  const validPokemon = team.filter((p): p is TeamPokemon => p !== null);
  
  if (validPokemon.length === 0) {
    return getEmptyAnalysis();
  }

  const offensiveCoverage = calculateOffensiveCoverage(validPokemon);
  const defensiveWeaknesses = calculateDefensiveWeaknesses(validPokemon);
  const criticalWeaknesses = findCriticalWeaknesses(defensiveWeaknesses);
  const averageStats = calculateAverageStats(validPokemon);
  const synergyScore = calculateSynergyScore(offensiveCoverage, defensiveWeaknesses, averageStats);

  return {
    synergyScore,
    offensiveCoverage,
    defensiveWeaknesses,
    criticalWeaknesses,
    suggestions: [],
    averageStats,
  };
}

function calculateOffensiveCoverage(pokemon: TeamPokemon[]): Record<PokemonType, number> {
  const coverage: Record<string, number> = {};
  const allTypes: PokemonType[] = Object.keys(TYPE_CHART) as PokemonType[];
  
  allTypes.forEach(type => {
    coverage[type] = 0;
  });

  pokemon.forEach(p => {
    p.types.forEach(t => {
      const type = t.type.name as PokemonType;
      // Count how many types this pokemon can hit super effectively
      allTypes.forEach(defendingType => {
        if (TYPE_CHART[defendingType]?.weak.includes(type)) {
          coverage[defendingType]++;
        }
      });
    });
  });

  return coverage as Record<PokemonType, number>;
}

function calculateDefensiveWeaknesses(pokemon: TeamPokemon[]): Record<PokemonType, number> {
  const weaknesses: Record<string, number> = {};
  const allTypes: PokemonType[] = Object.keys(TYPE_CHART) as PokemonType[];
  
  allTypes.forEach(type => {
    weaknesses[type] = 0;
  });

  pokemon.forEach(p => {
    const pokemonTypes = p.types.map(t => t.type.name as PokemonType);
    
    allTypes.forEach(attackingType => {
      let multiplier = 1;
      
      pokemonTypes.forEach(defType => {
        if (TYPE_CHART[defType]?.weak.includes(attackingType)) {
          multiplier *= 2;
        } else if (TYPE_CHART[defType]?.resist.includes(attackingType)) {
          multiplier *= 0.5;
        } else if (TYPE_CHART[defType]?.immune.includes(attackingType)) {
          multiplier = 0;
        }
      });
      
      if (multiplier > 1) {
        weaknesses[attackingType]++;
      }
    });
  });

  return weaknesses as Record<PokemonType, number>;
}

function findCriticalWeaknesses(weaknesses: Record<PokemonType, number>): PokemonType[] {
  const critical: PokemonType[] = [];
  const teamSize = 6;
  
  Object.entries(weaknesses).forEach(([type, count]) => {
    // If more than half the team is weak to a type, it's critical
    if (count >= teamSize / 2) {
      critical.push(type as PokemonType);
    }
  });
  
  return critical;
}

function calculateAverageStats(pokemon: TeamPokemon[]) {
  const totals = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  pokemon.forEach(p => {
    p.stats.forEach(s => {
      switch (s.stat.name) {
        case 'hp':
          totals.hp += s.base_stat;
          break;
        case 'attack':
          totals.attack += s.base_stat;
          break;
        case 'defense':
          totals.defense += s.base_stat;
          break;
        case 'special-attack':
          totals.specialAttack += s.base_stat;
          break;
        case 'special-defense':
          totals.specialDefense += s.base_stat;
          break;
        case 'speed':
          totals.speed += s.base_stat;
          break;
      }
    });
  });

  const count = pokemon.length || 1;

  return {
    hp: Math.round(totals.hp / count),
    attack: Math.round(totals.attack / count),
    defense: Math.round(totals.defense / count),
    specialAttack: Math.round(totals.specialAttack / count),
    specialDefense: Math.round(totals.specialDefense / count),
    speed: Math.round(totals.speed / count),
  };
}

function calculateSynergyScore(
  coverage: Record<PokemonType, number>,
  weaknesses: Record<PokemonType, number>,
  stats: Record<string, number>
): number {
  let score = 50; // Base score

  // Offensive coverage (0-30 points)
  const avgCoverage = Object.values(coverage).reduce((a, b) => a + b, 0) / 18;
  const coverageScore = Math.min(30, avgCoverage * 5);
  score += coverageScore;

  // Defensive weaknesses (-20 to 0 points)
  const totalWeaknesses = Object.values(weaknesses).reduce((a, b) => a + b, 0);
  const weaknessScore = Math.max(-20, -totalWeaknesses * 2);
  score += weaknessScore;

  // Stat balance (0-20 points)
  const statValues = Object.values(stats);
  const avgStat = statValues.reduce((a, b) => a + b, 0) / statValues.length;
  const statScore = Math.min(20, avgStat / 5);
  score += statScore;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getEmptyAnalysis(): TeamAnalysis {
  const emptyTypes: Record<PokemonType, number> = {
    normal: 0, fire: 0, water: 0, electric: 0, grass: 0, ice: 0,
    fighting: 0, poison: 0, ground: 0, flying: 0, psychic: 0, bug: 0,
    rock: 0, ghost: 0, dragon: 0, dark: 0, steel: 0, fairy: 0,
  };

  return {
    synergyScore: 0,
    offensiveCoverage: emptyTypes,
    defensiveWeaknesses: emptyTypes,
    criticalWeaknesses: [],
    suggestions: [],
    averageStats: {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    },
  };
}

