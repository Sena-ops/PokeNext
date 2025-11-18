import { useMemo } from 'react';
import { useTeamStore } from '@/store/team-store';
import { analyzeTeam } from '@/lib/analysis/team-analyzer';

export function useTeamAnalysis() {
  const currentTeam = useTeamStore((state) => state.currentTeam);

  const analysis = useMemo(() => {
    return analyzeTeam(currentTeam);
  }, [currentTeam]);

  return analysis;
}

