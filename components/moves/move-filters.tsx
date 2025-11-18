'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { POKEMON_TYPES, TYPE_COLORS } from '@/lib/constants/pokemon-types';
import { PokemonType } from '@/types/pokemon';
import { Search, Filter } from 'lucide-react';

export interface MoveFilters {
  search: string;
  type: string | null;
  damageClass: 'physical' | 'special' | 'status' | null;
  minPower: number | null;
}

interface MoveFiltersProps {
  filters: MoveFilters;
  onFiltersChange: (filters: MoveFilters) => void;
}

export function MoveFiltersComponent({ filters, onFiltersChange }: MoveFiltersProps) {
  const damageClasses = [
    { name: 'physical', icon: '⚔️', label: 'Physical' },
    { name: 'special', icon: '✨', label: 'Special' },
    { name: 'status', icon: '🛡️', label: 'Status' }
  ];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search moves..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          {/* Type Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">Type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filters.type === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, type: null })}
              >
                All
              </Badge>
              {POKEMON_TYPES.map((type) => (
                <Badge
                  key={type}
                  variant={filters.type === type ? 'default' : 'outline'}
                  style={
                    filters.type === type
                      ? {
                          backgroundColor: TYPE_COLORS[type].bg,
                          color: TYPE_COLORS[type].text,
                          borderColor: TYPE_COLORS[type].bg
                        }
                      : undefined
                  }
                  className="cursor-pointer capitalize"
                  onClick={() => onFiltersChange({ ...filters, type })}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Damage Class Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium">Damage Class</span>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={filters.damageClass === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, damageClass: null })}
              >
                All
              </Badge>
              {damageClasses.map((dc) => (
                <Badge
                  key={dc.name}
                  variant={filters.damageClass === dc.name ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFiltersChange({ 
                    ...filters, 
                    damageClass: dc.name as 'physical' | 'special' | 'status' 
                  })}
                >
                  <span className="mr-1">{dc.icon}</span>
                  {dc.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

