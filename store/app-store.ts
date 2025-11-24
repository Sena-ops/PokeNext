import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Achievement, Battle, WeatherData, SharedTeam, TeamVote, ChatMessage, WeatherEvent, DailyPokemon } from '@/types/app';
import { TeamPokemon } from '@/types/pokemon';

// Default user profile
const createDefaultUserProfile = () => ({
  id: Date.now().toString(),
  name: 'Trainer',
  level: 1,
  xp: 0,
  achievements: [],
  stats: {
    teamsCreated: 0,
    battlesWon: 0,
    battlesLost: 0,
    winStreak: 0,
    maxWinStreak: 0,
    pokemonCollected: 0,
    sharedTeams: 0,
    teamLikes: 0,
  },
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: createDefaultUserProfile(),
      currentTeam: Array(6).fill(null),
      battleHistory: [],
      achievements: [],
      weatherData: null,
      weatherEvent: null,
      dailyPokemon: null,
      sharedTeams: [],
      teamVotes: [],
      coachHistory: [],

      updateUserProfile: (updates) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...updates,
            lastActive: new Date().toISOString(),
          },
        }));
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          const achievement = state.achievements.find((a) => a.id === achievementId);
          if (!achievement || achievement.unlocked) return state;

          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString(),
          };

          const newAchievements = state.achievements.map((a) =>
            a.id === achievementId ? unlockedAchievement : a
          );

          const newXP = state.userProfile.xp + achievement.points;
          const newLevel = Math.floor(newXP / 100) + 1;

          return {
            achievements: newAchievements,
            userProfile: {
              ...state.userProfile,
              xp: newXP,
              level: newLevel,
              achievements: state.userProfile.achievements.concat(unlockedAchievement),
            },
          };
        });
      },

      addBattle: (battle) => {
        set((state) => {
          const isWin = battle.winner === 'team1';
          const newWinStreak = isWin ? state.userProfile.stats.winStreak + 1 : 0;
          const maxWinStreak = Math.max(newWinStreak, state.userProfile.stats.maxWinStreak);

          return {
            battleHistory: [battle, ...state.battleHistory].slice(0, 50),
            userProfile: {
              ...state.userProfile,
              stats: {
                ...state.userProfile.stats,
                battlesWon: state.userProfile.stats.battlesWon + (isWin ? 1 : 0),
                battlesLost: state.userProfile.stats.battlesLost + (!isWin ? 1 : 0),
                winStreak: newWinStreak,
                maxWinStreak,
              },
            },
          };
        });
      },

      updateWeather: (weather) => {
        set({ weatherData: weather });
      },

      addSharedTeam: (team) => {
        set((state) => ({
          sharedTeams: [team, ...state.sharedTeams],
          userProfile: {
            ...state.userProfile,
            stats: {
              ...state.userProfile.stats,
              sharedTeams: state.userProfile.stats.sharedTeams + 1,
            },
          },
        }));
      },

      toggleTeamVote: (teamId, type) => {
        set((state) => {
          const userId = state.userProfile.id;
          const existingVote = state.teamVotes.find(
            (v) => v.teamId === teamId && v.userId === userId && v.type === type
          );

          let newVotes;
          let updatedTeams;

          if (existingVote) {
            // Remove vote
            newVotes = state.teamVotes.filter(
              (v) => !(v.teamId === teamId && v.userId === userId && v.type === type)
            );
            updatedTeams = state.sharedTeams.map((t) =>
              t.id === teamId ? { ...t, likes: Math.max(0, t.likes - 1) } : t
            );
          } else {
            // Add vote
            newVotes = [
              ...state.teamVotes,
              { teamId, userId, type, timestamp: new Date().toISOString() },
            ];
            updatedTeams = state.sharedTeams.map((t) =>
              t.id === teamId ? { ...t, likes: t.likes + 1 } : t
            );
          }

          return {
            teamVotes: newVotes,
            sharedTeams: updatedTeams,
          };
        });
      },

      addCoachMessage: (message) => {
        set((state) => ({
          coachHistory: [...state.coachHistory, message],
        }));
      },

      clearCoachHistory: () => {
        set({ coachHistory: [] });
      },
    }),
    {
      name: 'pokenext-app-storage',
    }
  )
);
