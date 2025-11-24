import { Achievement, UserProfile } from '@/types/app';
import { TeamPokemon } from '@/types/pokemon';

// Lista completa de conquistas
export const allAchievements: Achievement[] = [
  // BUILDER CATEGORY
  {
    id: 'first_team',
    name: 'Primeiros Passos',
    description: 'Crie seu primeiro time',
    icon: '🎯',
    points: 10,
    category: 'builder',
    unlocked: false,
    check: (user) => user.stats.teamsCreated >= 1,
  },
  {
    id: 'team_master',
    name: 'Mestre dos Times',
    description: 'Crie 10 times diferentes',
    icon: '👑',
    points: 50,
    category: 'builder',
    unlocked: false,
    check: (user) => user.stats.teamsCreated >= 10,
  },
  {
    id: 'type_master',
    name: 'Especialista de Tipos',
    description: 'Crie um time mono-tipo',
    icon: '🎨',
    points: 25,
    category: 'builder',
    unlocked: false,
  },
  {
    id: 'rainbow_team',
    name: 'Time Arco-Íris',
    description: 'Crie um time com 6 tipos diferentes',
    icon: '🌈',
    points: 30,
    category: 'builder',
    unlocked: false,
  },
  {
    id: 'legendary_collector',
    name: 'Colecionador Lendário',
    description: 'Tenha um time completo de lendários',
    icon: '⭐',
    points: 100,
    category: 'builder',
    unlocked: false,
  },
  {
    id: 'starter_love',
    name: 'Amor pelos Iniciais',
    description: 'Crie um time com starters de diferentes gerações',
    icon: '💚',
    points: 40,
    category: 'builder',
    unlocked: false,
  },

  // BATTLER CATEGORY
  {
    id: 'first_victory',
    name: 'Primeira Vitória',
    description: 'Vença sua primeira batalha',
    icon: '🏆',
    points: 15,
    category: 'battler',
    unlocked: false,
    check: (user) => user.stats.battlesWon >= 1,
  },
  {
    id: 'win_streak_5',
    name: 'Imparável',
    description: 'Vença 5 batalhas seguidas',
    icon: '🔥',
    points: 50,
    category: 'battler',
    unlocked: false,
    check: (user) => user.stats.maxWinStreak >= 5,
  },
  {
    id: 'win_streak_10',
    name: 'Invencível',
    description: 'Vença 10 batalhas seguidas',
    icon: '💪',
    points: 100,
    category: 'battler',
    unlocked: false,
    check: (user) => user.stats.maxWinStreak >= 10,
  },
  {
    id: 'battle_veteran',
    name: 'Veterano das Batalhas',
    description: 'Complete 50 batalhas',
    icon: '⚔️',
    points: 75,
    category: 'battler',
    unlocked: false,
    check: (user) => user.stats.battlesWon + user.stats.battlesLost >= 50,
  },
  {
    id: 'comeback_king',
    name: 'Rei do Comeback',
    description: 'Vença após perder 3 batalhas seguidas',
    icon: '👊',
    points: 35,
    category: 'battler',
    unlocked: false,
  },

  // SOCIAL CATEGORY
  {
    id: 'first_share',
    name: 'Compartilhando Estratégias',
    description: 'Compartilhe seu primeiro time',
    icon: '📤',
    points: 20,
    category: 'social',
    unlocked: false,
    check: (user) => user.stats.sharedTeams >= 1,
  },
  {
    id: 'popular_team',
    name: 'Time Popular',
    description: 'Receba 10 likes em um time',
    icon: '❤️',
    points: 40,
    category: 'social',
    unlocked: false,
    check: (user) => user.stats.teamLikes >= 10,
  },
  {
    id: 'viral_team',
    name: 'Time Viral',
    description: 'Receba 50 likes em seus times',
    icon: '🌟',
    points: 100,
    category: 'social',
    unlocked: false,
    check: (user) => user.stats.teamLikes >= 50,
  },
  {
    id: 'team_of_week',
    name: 'Time da Semana',
    description: 'Tenha o time mais votado da semana',
    icon: '🏅',
    points: 150,
    category: 'social',
    unlocked: false,
  },

  // COLLECTOR CATEGORY
  {
    id: 'pokedex_starter',
    name: 'Início da Jornada',
    description: 'Adicione 10 Pokémon diferentes em times',
    icon: '📖',
    points: 15,
    category: 'collector',
    unlocked: false,
    check: (user) => user.stats.pokemonCollected >= 10,
  },
  {
    id: 'pokedex_collector',
    name: 'Colecionador',
    description: 'Adicione 50 Pokémon diferentes em times',
    icon: '📚',
    points: 50,
    category: 'collector',
    unlocked: false,
    check: (user) => user.stats.pokemonCollected >= 50,
  },
  {
    id: 'pokedex_master',
    name: 'Mestre da Pokédex',
    description: 'Adicione 151 Pokémon diferentes em times',
    icon: '🎓',
    points: 200,
    category: 'collector',
    unlocked: false,
    check: (user) => user.stats.pokemonCollected >= 151,
  },
  {
    id: 'gen1_fan',
    name: 'Nostálgico',
    description: 'Crie um time apenas com Pokémon da Gen 1',
    icon: '🕹️',
    points: 30,
    category: 'collector',
    unlocked: false,
  },

  // EXPLORER CATEGORY
  {
    id: 'weather_watcher',
    name: 'Observador do Clima',
    description: 'Capture um Pokémon do dia',
    icon: '🌤️',
    points: 25,
    category: 'explorer',
    unlocked: false,
  },
  {
    id: 'weather_master',
    name: 'Mestre do Clima',
    description: 'Capture Pokémon em 5 climas diferentes',
    icon: '🌦️',
    points: 60,
    category: 'explorer',
    unlocked: false,
  },
  {
    id: 'coach_student',
    name: 'Aluno do Professor Oak',
    description: 'Peça uma análise ao AI Coach',
    icon: '🎓',
    points: 20,
    category: 'explorer',
    unlocked: false,
  },
  {
    id: 'strategy_expert',
    name: 'Estrategista Experiente',
    description: 'Aplique 10 sugestões do AI Coach',
    icon: '🧠',
    points: 75,
    category: 'explorer',
    unlocked: false,
  },
];

// Sistema de XP e níveis
export class AchievementTracker {
  static calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }

  static getXPForNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    return currentLevel * 100;
  }

  static getLevelProgress(xp: number): number {
    const currentLevel = this.calculateLevel(xp);
    const currentLevelXP = (currentLevel - 1) * 100;
    const nextLevelXP = currentLevel * 100;
    const progress = (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
    return Math.min(progress * 100, 100);
  }

  static getTitle(level: number): string {
    if (level >= 50) return 'Mestre Pokémon';
    if (level >= 40) return 'Campeão Regional';
    if (level >= 30) return 'Líder de Ginásio';
    if (level >= 20) return 'Ace Trainer';
    if (level >= 10) return 'Treinador Veterano';
    if (level >= 5) return 'Treinador Júnior';
    return 'Treinador Novato';
  }

  static checkAchievements(
    userData: UserProfile,
    context?: {
      currentTeam?: (TeamPokemon | null)[];
      justCreatedTeam?: boolean;
      justWonBattle?: boolean;
      justSharedTeam?: boolean;
    }
  ): string[] {
    const unlockedIds: string[] = [];

    for (const achievement of allAchievements) {
      if (achievement.unlocked) continue;

      let shouldUnlock = false;

      // Verificar com a função check se existir
      if (achievement.check && achievement.check(userData)) {
        shouldUnlock = true;
      }

      // Verificações especiais baseadas no contexto
      if (context?.currentTeam && context.justCreatedTeam) {
        shouldUnlock = shouldUnlock || this.checkTeamAchievements(achievement, context.currentTeam);
      }

      if (shouldUnlock) {
        unlockedIds.push(achievement.id);
      }
    }

    return unlockedIds;
  }

  private static checkTeamAchievements(
    achievement: Achievement,
    team: (TeamPokemon | null)[]
  ): boolean {
    const validTeam = team.filter((p) => p !== null) as TeamPokemon[];
    if (validTeam.length === 0) return false;

    switch (achievement.id) {
      case 'type_master': {
        // Mono-type team
        const firstType = validTeam[0].types[0].type.name;
        return validTeam.every((p) => p.types.some((t) => t.type.name === firstType));
      }

      case 'rainbow_team': {
        // 6 tipos diferentes
        const types = new Set(validTeam.flatMap((p) => p.types.map((t) => t.type.name)));
        return types.size >= 6;
      }

      case 'legendary_collector': {
        // Lista de IDs de lendários (simplificado)
        const legendaryIds = [
          144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382,
          383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492,
          493, 494,
        ];
        return validTeam.every((p) => legendaryIds.includes(p.id));
      }

      case 'starter_love': {
        // IDs dos starters (simplificado)
        const starterIds = [
          1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656,
          722, 725, 728, 810, 813, 816,
        ];
        const startersInTeam = validTeam.filter((p) => starterIds.includes(p.id));
        return startersInTeam.length >= 3;
      }

      case 'gen1_fan': {
        // Pokémon da Gen 1 (ID 1-151)
        return validTeam.every((p) => p.id >= 1 && p.id <= 151);
      }

      default:
        return false;
    }
  }
}
