"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { TeamCard } from './TeamCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Clock, Heart, Filter } from 'lucide-react';

type SortOption = 'recent' | 'popular' | 'trending';
type FilterOption = 'all' | string;

export function TeamShowcase() {
  const { sharedTeams } = useAppStore();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterType, setFilterType] = useState<FilterOption>('all');

  const sortedAndFilteredTeams = useMemo(() => {
    let filtered = [...sharedTeams];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(search.toLowerCase()) ||
          team.description.toLowerCase().includes(search.toLowerCase()) ||
          team.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((team) => team.tags.includes(filterType));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'trending':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    return filtered;
  }, [sharedTeams, search, sortBy, filterType]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    sharedTeams.forEach((team) => {
      team.tags.forEach((tag) => types.add(tag));
    });
    return Array.from(types).slice(0, 10);
  }, [sharedTeams]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar times por nome, autor ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar:</span>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('recent')}
                  className="gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Recente
                </Button>
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('popular')}
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Popular
                </Button>
                <Button
                  variant={sortBy === 'trending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('trending')}
                  className="gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Em Alta
                </Button>
              </div>
            </div>

            {/* Type Filter */}
            {availableTypes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filtrar:
                </span>
                <Badge
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilterType('all')}
                >
                  Todos
                </Badge>
                {availableTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => setFilterType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedAndFilteredTeams.length} time(s) encontrado(s)
        </p>
      </div>

      {/* Teams Grid */}
      {sortedAndFilteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAndFilteredTeams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">Nenhum time encontrado</h3>
          <p className="text-muted-foreground">
            {search || filterType !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Seja o primeiro a compartilhar um time!'}
          </p>
        </Card>
      )}
    </div>
  );
}
