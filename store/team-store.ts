import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, TeamPokemon } from '@/types/pokemon';

interface TeamState {
  currentTeam: (TeamPokemon | null)[];
  savedTeams: Team[];
  addPokemon: (pokemon: TeamPokemon, position: number) => void;
  removePokemon: (position: number) => void;
  movePokemon: (fromPosition: number, toPosition: number) => void;
  clearTeam: () => void;
  saveTeam: (name: string) => void;
  loadTeam: (teamId: string) => void;
  deleteTeam: (teamId: string) => void;
  exportTeam: () => string;
  importTeam: (data: string) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      currentTeam: Array(6).fill(null),
      savedTeams: [],

      addPokemon: (pokemon, position) => {
        set((state) => {
          const newTeam = [...state.currentTeam];
          newTeam[position] = { ...pokemon, position };
          return { currentTeam: newTeam };
        });
      },

      removePokemon: (position) => {
        set((state) => {
          const newTeam = [...state.currentTeam];
          newTeam[position] = null;
          return { currentTeam: newTeam };
        });
      },

      movePokemon: (fromPosition, toPosition) => {
        set((state) => {
          const newTeam = [...state.currentTeam];
          const pokemon = newTeam[fromPosition];
          newTeam[fromPosition] = newTeam[toPosition];
          newTeam[toPosition] = pokemon;
          
          // Update positions
          if (newTeam[fromPosition]) {
            newTeam[fromPosition]!.position = fromPosition;
          }
          if (newTeam[toPosition]) {
            newTeam[toPosition]!.position = toPosition;
          }
          
          return { currentTeam: newTeam };
        });
      },

      clearTeam: () => {
        set({ currentTeam: Array(6).fill(null) });
      },

      saveTeam: (name) => {
        const state = get();
        const newTeam: Team = {
          id: Date.now().toString(),
          name,
          pokemon: state.currentTeam,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          savedTeams: [...state.savedTeams, newTeam],
        }));
      },

      loadTeam: (teamId) => {
        const state = get();
        const team = state.savedTeams.find((t) => t.id === teamId);
        if (team) {
          set({ currentTeam: team.pokemon });
        }
      },

      deleteTeam: (teamId) => {
        set((state) => ({
          savedTeams: state.savedTeams.filter((t) => t.id !== teamId),
        }));
      },

      exportTeam: () => {
        const state = get();
        return JSON.stringify(state.currentTeam);
      },

      importTeam: (data) => {
        try {
          const team = JSON.parse(data);
          if (Array.isArray(team) && team.length === 6) {
            set({ currentTeam: team });
          }
        } catch (error) {
          console.error('Failed to import team:', error);
        }
      },
    }),
    {
      name: 'pokemon-team-storage',
    }
  )
);

