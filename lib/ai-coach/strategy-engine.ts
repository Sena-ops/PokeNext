import { TeamPokemon, PokemonType } from '@/types/pokemon';
import {
  StrategyAnalysis,
  TypeWeakness,
  TypeStrength,
  CoachSuggestion,
  CounterTeam,
  RoleAnalysis,
  Synergy,
} from '@/types/app';

// Type effectiveness chart
const typeChart: Record<PokemonType, { weakTo: PokemonType[]; resistantTo: PokemonType[]; immuneTo: PokemonType[] }> = {
  normal: { weakTo: ['fighting'], resistantTo: [], immuneTo: ['ghost'] },
  fire: { weakTo: ['water', 'ground', 'rock'], resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immuneTo: [] },
  water: { weakTo: ['electric', 'grass'], resistantTo: ['fire', 'water', 'ice', 'steel'], immuneTo: [] },
  electric: { weakTo: ['ground'], resistantTo: ['electric', 'flying', 'steel'], immuneTo: [] },
  grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resistantTo: ['water', 'electric', 'grass', 'ground'], immuneTo: [] },
  ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resistantTo: ['ice'], immuneTo: [] },
  fighting: { weakTo: ['flying', 'psychic', 'fairy'], resistantTo: ['bug', 'rock', 'dark'], immuneTo: [] },
  poison: { weakTo: ['ground', 'psychic'], resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immuneTo: [] },
  ground: { weakTo: ['water', 'grass', 'ice'], resistantTo: ['poison', 'rock'], immuneTo: ['electric'] },
  flying: { weakTo: ['electric', 'ice', 'rock'], resistantTo: ['grass', 'fighting', 'bug'], immuneTo: ['ground'] },
  psychic: { weakTo: ['bug', 'ghost', 'dark'], resistantTo: ['fighting', 'psychic'], immuneTo: [] },
  bug: { weakTo: ['fire', 'flying', 'rock'], resistantTo: ['grass', 'fighting', 'ground'], immuneTo: [] },
  rock: { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resistantTo: ['normal', 'fire', 'poison', 'flying'], immuneTo: [] },
  ghost: { weakTo: ['ghost', 'dark'], resistantTo: ['poison', 'bug'], immuneTo: ['normal', 'fighting'] },
  dragon: { weakTo: ['ice', 'dragon', 'fairy'], resistantTo: ['fire', 'water', 'electric', 'grass'], immuneTo: [] },
  dark: { weakTo: ['fighting', 'bug', 'fairy'], resistantTo: ['ghost', 'dark'], immuneTo: ['psychic'] },
  steel: { weakTo: ['fire', 'fighting', 'ground'], resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immuneTo: ['poison'] },
  fairy: { weakTo: ['poison', 'steel'], resistantTo: ['fighting', 'bug', 'dark'], immuneTo: ['dragon'] },
};

export class StrategyEngine {
  static analyzeTeam(team: (TeamPokemon | null)[]): StrategyAnalysis {
    const validTeam = team.filter((p) => p !== null) as TeamPokemon[];

    if (validTeam.length === 0) {
      return {
        teamScore: 0,
        weaknesses: [],
        strengths: [],
        suggestions: [],
        battleStrategy: 'Adicione Pokémon ao time para receber análise estratégica.',
        counterTeams: [],
        roleBalance: this.getDefaultRoleAnalysis(),
        synergies: [],
      };
    }

    const weaknesses = this.calculateWeaknesses(validTeam);
    const strengths = this.calculateStrengths(validTeam);
    const roleBalance = this.analyzeRoles(validTeam);
    const synergies = this.findSynergies(validTeam);
    const teamScore = this.calculateTeamScore(weaknesses, strengths, roleBalance, synergies);
    const suggestions = this.generateSuggestions(validTeam, weaknesses, strengths, roleBalance);
    const counterTeams = this.identifyCounterTeams(validTeam, weaknesses);
    const battleStrategy = this.generateBattleStrategy(validTeam, roleBalance, synergies);

    return {
      teamScore,
      weaknesses,
      strengths,
      suggestions,
      battleStrategy,
      counterTeams,
      roleBalance,
      synergies,
    };
  }

  private static calculateWeaknesses(team: TeamPokemon[]): TypeWeakness[] {
    const weaknessCount: Record<string, { count: number; pokemon: string[] }> = {};

    team.forEach((pokemon) => {
      const pokemonWeaknesses = this.getPokemonWeaknesses(pokemon);

      pokemonWeaknesses.forEach((type) => {
        if (!weaknessCount[type]) {
          weaknessCount[type] = { count: 0, pokemon: [] };
        }
        weaknessCount[type].count++;
        weaknessCount[type].pokemon.push(pokemon.name);
      });
    });

    return Object.entries(weaknessCount)
      .map(([type, data]) => ({
        type: type as PokemonType,
        count: data.count,
        severity: this.getWeaknessSeverity(data.count, team.length),
        affectedPokemon: data.pokemon,
      }))
      .sort((a, b) => b.count - a.count);
  }

  private static getPokemonWeaknesses(pokemon: TeamPokemon): PokemonType[] {
    const types = pokemon.types.map((t) => t.type.name);
    const allWeaknesses: PokemonType[] = [];

    types.forEach((type) => {
      const typeData = typeChart[type as PokemonType];
      if (typeData) {
        allWeaknesses.push(...typeData.weakTo);
      }
    });

    // Remove duplicates and check for immunities/resistances
    const uniqueWeaknesses = Array.from(new Set(allWeaknesses));

    return uniqueWeaknesses.filter((weakness) => {
      // Check if any type is immune or resistant
      const hasImmunity = types.some((type) =>
        typeChart[type as PokemonType]?.immuneTo.includes(weakness)
      );
      const hasResistance = types.some((type) =>
        typeChart[type as PokemonType]?.resistantTo.includes(weakness)
      );

      // Count how many weaknesses vs resistances
      const weakCount = allWeaknesses.filter((w) => w === weakness).length;
      const resistCount = types.filter((type) =>
        typeChart[type as PokemonType]?.resistantTo.includes(weakness)
      ).length;

      return !hasImmunity && weakCount > resistCount;
    });
  }

  private static getWeaknessSeverity(count: number, teamSize: number): 'critical' | 'high' | 'medium' | 'low' {
    const percentage = count / teamSize;
    if (percentage >= 0.67) return 'critical';
    if (percentage >= 0.5) return 'high';
    if (percentage >= 0.33) return 'medium';
    return 'low';
  }

  private static calculateStrengths(team: TeamPokemon[]): TypeStrength[] {
    const coverageCount: Record<string, Set<string>> = {};

    team.forEach((pokemon) => {
      const types = pokemon.types.map((t) => t.type.name);

      types.forEach((type) => {
        if (!coverageCount[type]) {
          coverageCount[type] = new Set();
        }
        coverageCount[type].add(pokemon.name);
      });
    });

    return Object.entries(coverageCount)
      .map(([type, pokemonSet]) => ({
        type: type as PokemonType,
        coverage: pokemonSet.size,
        pokemonWithType: Array.from(pokemonSet),
      }))
      .sort((a, b) => b.coverage - a.coverage);
  }

  private static analyzeRoles(team: TeamPokemon[]): RoleAnalysis {
    let physicalSweepers = 0;
    let specialSweepers = 0;
    let physicalTanks = 0;
    let specialTanks = 0;
    let speedsters = 0;
    let wallBreakers = 0;
    let supports = 0;
    let balanced = 0;

    team.forEach((pokemon) => {
      const stats = this.getStats(pokemon);

      if (stats.attack > 110 && stats.speed > 100) physicalSweepers++;
      else if (stats.specialAttack > 110 && stats.speed > 100) specialSweepers++;
      else if (stats.defense > 100 && stats.hp > 90) physicalTanks++;
      else if (stats.specialDefense > 100 && stats.hp > 90) specialTanks++;
      else if (stats.speed > 120) speedsters++;
      else if (stats.attack > 120 || stats.specialAttack > 120) wallBreakers++;
      else if (stats.hp > 100) supports++;
      else balanced++;
    });

    return {
      physicalSweepers,
      specialSweepers,
      physicalTanks,
      specialTanks,
      speedsters,
      wallBreakers,
      supports,
      balanced,
      recommendation: this.getRoleRecommendation({
        physicalSweepers,
        specialSweepers,
        physicalTanks,
        specialTanks,
        speedsters,
        wallBreakers,
        supports,
        balanced,
      }),
    };
  }

  private static getStats(pokemon: TeamPokemon) {
    const getStatValue = (name: string) =>
      pokemon.stats.find((s) => s.stat.name === name)?.base_stat || 0;

    return {
      hp: getStatValue('hp'),
      attack: getStatValue('attack'),
      defense: getStatValue('defense'),
      specialAttack: getStatValue('special-attack'),
      specialDefense: getStatValue('special-defense'),
      speed: getStatValue('speed'),
    };
  }

  private static getRoleRecommendation(roles: Omit<RoleAnalysis, 'recommendation'>): string {
    const totalRoles = Object.values(roles).reduce((sum, val) => sum + val, 0);

    if (roles.physicalTanks + roles.specialTanks === 0) {
      return 'Seu time precisa de mais tanques defensivos!';
    }
    if (roles.physicalSweepers + roles.specialSweepers === 0) {
      return 'Adicione sweepers ofensivos para pressionar o oponente!';
    }
    if (roles.speedsters >= 4) {
      return 'Time muito focado em velocidade - considere mais equilíbrio.';
    }
    if (roles.balanced >= 4) {
      return 'Time equilibrado - considere especialização para maior impacto.';
    }

    return 'Boa distribuição de roles! Continue refinando.';
  }

  private static findSynergies(team: TeamPokemon[]): Synergy[] {
    const synergies: Synergy[] = [];

    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const pokemon1 = team[i];
        const pokemon2 = team[j];

        // Offensive synergy - cobrem fraquezas um do outro
        const p1Weaknesses = this.getPokemonWeaknesses(pokemon1);
        const p2Types = pokemon2.types.map((t) => t.type.name);

        const offensiveCoverage = p1Weaknesses.filter((weakness) =>
          p2Types.some((type) => {
            const attacks = this.getSuperEffectiveAgainst(type as PokemonType);
            return attacks.includes(weakness);
          })
        );

        if (offensiveCoverage.length >= 2) {
          synergies.push({
            pokemon1: pokemon1.name,
            pokemon2: pokemon2.name,
            type: 'offensive',
            description: `${pokemon2.name} cobre fraquezas de ${pokemon1.name} atacando ${offensiveCoverage.join(', ')}`,
            score: offensiveCoverage.length * 20,
          });
        }
      }
    }

    return synergies.slice(0, 5);
  }

  private static getSuperEffectiveAgainst(type: PokemonType): PokemonType[] {
    // Simplified - in real implementation, check full type chart
    const effectiveness: Record<PokemonType, PokemonType[]> = {
      fire: ['grass', 'ice', 'bug', 'steel'],
      water: ['fire', 'ground', 'rock'],
      grass: ['water', 'ground', 'rock'],
      electric: ['water', 'flying'],
      ice: ['grass', 'ground', 'flying', 'dragon'],
      fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
      poison: ['grass', 'fairy'],
      ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
      flying: ['grass', 'fighting', 'bug'],
      psychic: ['fighting', 'poison'],
      bug: ['grass', 'psychic', 'dark'],
      rock: ['fire', 'ice', 'flying', 'bug'],
      ghost: ['psychic', 'ghost'],
      dragon: ['dragon'],
      dark: ['psychic', 'ghost'],
      steel: ['ice', 'rock', 'fairy'],
      fairy: ['fighting', 'dragon', 'dark'],
      normal: [],
    };

    return effectiveness[type] || [];
  }

  private static calculateTeamScore(
    weaknesses: TypeWeakness[],
    strengths: TypeStrength[],
    roleBalance: RoleAnalysis,
    synergies: Synergy[]
  ): number {
    let score = 50; // Base score

    // Penalize critical weaknesses
    const criticalWeaknesses = weaknesses.filter((w) => w.severity === 'critical').length;
    score -= criticalWeaknesses * 15;

    const highWeaknesses = weaknesses.filter((w) => w.severity === 'high').length;
    score -= highWeaknesses * 8;

    // Reward type coverage
    score += Math.min(strengths.length * 3, 20);

    // Reward role diversity
    const roleCount = Object.values(roleBalance).filter((v) => typeof v === 'number' && v > 0).length;
    score += roleCount * 2;

    // Reward synergies
    score += Math.min(synergies.length * 5, 15);

    return Math.max(0, Math.min(100, score));
  }

  private static generateSuggestions(
    team: TeamPokemon[],
    weaknesses: TypeWeakness[],
    strengths: TypeStrength[],
    roleBalance: RoleAnalysis
  ): CoachSuggestion[] {
    const suggestions: CoachSuggestion[] = [];

    // Suggest to cover critical weaknesses
    const criticalWeaknesses = weaknesses.filter((w) => w.severity === 'critical' || w.severity === 'high');

    criticalWeaknesses.slice(0, 2).forEach((weakness) => {
      suggestions.push({
        id: `cover-${weakness.type}`,
        type: 'add',
        priority: 'high',
        title: `Cubra fraqueza a ${weakness.type}`,
        description: `${weakness.count} Pokémon são fracos contra ${weakness.type}. Adicione um Pokémon resistente ou imune.`,
        reason: `Fraqueza ${weakness.severity} detectada`,
        expectedImpact: 25,
      });
    });

    // Role balance suggestions
    if (roleBalance.physicalTanks + roleBalance.specialTanks === 0) {
      suggestions.push({
        id: 'add-tank',
        type: 'strategy',
        priority: 'high',
        title: 'Adicione um Tank',
        description: 'Seu time não tem tanques. Considere adicionar um Pokémon com alta defesa e HP.',
        reason: 'Falta de sustentabilidade defensiva',
        expectedImpact: 30,
      });
    }

    return suggestions.slice(0, 5);
  }

  private static identifyCounterTeams(team: TeamPokemon[], weaknesses: TypeWeakness[]): CounterTeam[] {
    const counterTeams: CounterTeam[] = [];

    // Identify common meta threats
    if (weaknesses.some((w) => w.type === 'water' && w.severity !== 'low')) {
      counterTeams.push({
        name: 'Rain Team',
        commonPokemon: ['Kyogre', 'Pelipper', 'Swampert'],
        dangerLevel: 'high',
        counterStrategy: 'Use Pokémon elétricos ou grass. Mude o clima.',
      });
    }

    if (weaknesses.some((w) => w.type === 'fire' && w.severity !== 'low')) {
      counterTeams.push({
        name: 'Sun Team',
        commonPokemon: ['Groudon', 'Charizard', 'Venusaur'],
        dangerLevel: 'high',
        counterStrategy: 'Use Pokémon de água ou rock. Priorize velocidade.',
      });
    }

    return counterTeams;
  }

  private static generateBattleStrategy(
    team: TeamPokemon[],
    roleBalance: RoleAnalysis,
    synergies: Synergy[]
  ): string {
    const strategies: string[] = [];

    if (roleBalance.speedsters >= 2) {
      strategies.push('🏃 Estratégia de velocidade: Use seus speedsters para golpear primeiro e controlar o ritmo.');
    }

    if (roleBalance.physicalTanks + roleBalance.specialTanks >= 2) {
      strategies.push('🛡️ Jogo defensivo: Estabeleça seus tanks cedo e desgaste o oponente.');
    }

    if (roleBalance.wallBreakers >= 2) {
      strategies.push('💥 Pressão ofensiva: Use seus wallbreakers para quebrar defesas inimigas.');
    }

    if (synergies.length >= 3) {
      strategies.push(`⚡ Sinergias fortes: Aproveite as combinações entre ${synergies[0].pokemon1} e ${synergies[0].pokemon2}.`);
    }

    if (strategies.length === 0) {
      return '🎯 Estratégia equilibrada: Adapte-se ao time adversário e aproveite vantagens de tipo.';
    }

    return strategies.join('\n\n');
  }

  private static getDefaultRoleAnalysis(): RoleAnalysis {
    return {
      physicalSweepers: 0,
      specialSweepers: 0,
      physicalTanks: 0,
      specialTanks: 0,
      speedsters: 0,
      wallBreakers: 0,
      supports: 0,
      balanced: 0,
      recommendation: 'Adicione Pokémon ao seu time.',
    };
  }
}
