import { Pokemon, PokemonType, TeamPokemon } from './pokemon';

// ============================================
// ACHIEVEMENT SYSTEM TYPES
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'builder' | 'battler' | 'social' | 'collector' | 'explorer';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0-1
  maxProgress?: number;
  check?: (data: UserProfile) => boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  title?: string;
  achievements: Achievement[];
  stats: {
    teamsCreated: number;
    battlesWon: number;
    battlesLost: number;
    winStreak: number;
    maxWinStreak: number;
    pokemonCollected: number;
    sharedTeams: number;
    teamLikes: number;
  };
  createdAt: string;
  lastActive: string;
}

// ============================================
// BATTLE SIMULATOR TYPES
// ============================================

export interface Move {
  id: number;
  name: string;
  type: PokemonType;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  damageClass: 'physical' | 'special' | 'status';
  effectChance?: number;
  effect?: string;
  category: string;
}

export interface BattlePokemon extends Pokemon {
  currentHP: number;
  maxHP: number;
  moves: Move[];
  status?: 'paralysis' | 'sleep' | 'freeze' | 'burn' | 'poison' | 'badly-poison';
  statModifiers: {
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    accuracy: number;
    evasion: number;
  };
}

export interface BattleState {
  id: string;
  team1: BattlePokemon[];
  team2: BattlePokemon[];
  currentTurn: number;
  activeIndex1: number;
  activeIndex2: number;
  weather?: 'sun' | 'rain' | 'sandstorm' | 'hail' | 'fog';
  terrain?: 'electric' | 'grassy' | 'misty' | 'psychic';
  log: BattleLogEntry[];
  result?: 'team1' | 'team2' | 'draw';
  speed: 1 | 2 | 4;
}

export interface BattleLogEntry {
  turn: number;
  timestamp: string;
  type: 'move' | 'switch' | 'damage' | 'status' | 'faint' | 'message';
  message: string;
  pokemon?: string;
  move?: string;
  damage?: number;
}

export interface DamageCalculation {
  damage: number;
  isCritical: boolean;
  effectiveness: number;
  hasSTAB: boolean;
}

export interface Battle {
  id: string;
  team1Name: string;
  team2Name: string;
  winner: 'team1' | 'team2' | 'draw';
  turns: number;
  date: string;
  replay?: BattleState;
}

// ============================================
// SOCIAL HUB TYPES
// ============================================

export interface SharedTeam {
  id: string;
  code: string;
  name: string;
  description: string;
  author: string;
  authorId: string;
  pokemon: TeamPokemon[];
  likes: number;
  views: number;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamVote {
  teamId: string;
  userId: string;
  type: 'like' | 'favorite';
  timestamp: string;
}

export interface TeamComment {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface TeamOfTheWeek {
  team: SharedTeam;
  weekStart: string;
  weekEnd: string;
  totalVotes: number;
}

// ============================================
// AI COACH TYPES
// ============================================

export interface StrategyAnalysis {
  teamScore: number; // 0-100
  weaknesses: TypeWeakness[];
  strengths: TypeStrength[];
  suggestions: CoachSuggestion[];
  battleStrategy: string;
  counterTeams: CounterTeam[];
  roleBalance: RoleAnalysis;
  synergies: Synergy[];
}

export interface TypeWeakness {
  type: PokemonType;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedPokemon: string[];
}

export interface TypeStrength {
  type: PokemonType;
  coverage: number;
  pokemonWithType: string[];
}

export interface CoachSuggestion {
  id: string;
  type: 'add' | 'replace' | 'move' | 'strategy';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  pokemon?: Pokemon;
  replacePosition?: number;
  reason: string;
  expectedImpact: number; // 0-100
}

export interface CounterTeam {
  name: string;
  commonPokemon: string[];
  dangerLevel: 'extreme' | 'high' | 'medium' | 'low';
  counterStrategy: string;
}

export interface RoleAnalysis {
  physicalSweepers: number;
  specialSweepers: number;
  physicalTanks: number;
  specialTanks: number;
  speedsters: number;
  wallBreakers: number;
  supports: number;
  balanced: number;
  recommendation: string;
}

export interface Synergy {
  pokemon1: string;
  pokemon2: string;
  type: 'offensive' | 'defensive' | 'strategic';
  description: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
  analysis?: StrategyAnalysis;
}

// ============================================
// WEATHER EVENTS TYPES
// ============================================

export interface WeatherData {
  city: string;
  country: string;
  condition: 'Clear' | 'Rain' | 'Snow' | 'Clouds' | 'Thunderstorm' | 'Drizzle' | 'Mist' | 'Fog';
  temperature: number;
  humidity: number;
  description: string;
  timestamp: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface WeatherEvent {
  id: string;
  name: string;
  description: string;
  weather: WeatherData['condition'][];
  boostedTypes: PokemonType[];
  boostMultiplier: number;
  featuredPokemon: string[];
  duration: number; // minutes
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface DailyPokemon {
  pokemon: Pokemon;
  weather: WeatherData['condition'];
  bonus: string;
  date: string;
}

// ============================================
// APP STATE TYPES
// ============================================

export interface AppState {
  userProfile: UserProfile;
  currentTeam: (TeamPokemon | null)[];
  battleHistory: Battle[];
  achievements: Achievement[];
  weatherData: WeatherData | null;
  weatherEvent: WeatherEvent | null;
  dailyPokemon: DailyPokemon | null;
  sharedTeams: SharedTeam[];
  teamVotes: TeamVote[];
  coachHistory: ChatMessage[];

  // Actions
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  unlockAchievement: (achievementId: string) => void;
  addBattle: (battle: Battle) => void;
  updateWeather: (weather: WeatherData) => void;
  addSharedTeam: (team: SharedTeam) => void;
  toggleTeamVote: (teamId: string, type: 'like' | 'favorite') => void;
  addCoachMessage: (message: ChatMessage) => void;
  clearCoachHistory: () => void;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'achievement' | 'battle' | 'team' | 'weather' | 'info';
  title: string;
  message: string;
  icon?: string;
  action?: {
    label: string;
    url: string;
  };
  timestamp: string;
  read: boolean;
}
