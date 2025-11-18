'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAbilities, getAbility } from '@/lib/api/pokemon';
import { AbilityCard } from '@/components/abilities/ability-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Sparkles, Search, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ABILITIES_PER_PAGE = 20;

export default function AbilitiesPage() {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch abilities list
  const { data: abilitiesList, isLoading: isLoadingList } = useQuery({
    queryKey: ['abilities-list', page],
    queryFn: () => listAbilities(ABILITIES_PER_PAGE, page * ABILITIES_PER_PAGE),
    staleTime: 1000 * 60 * 60 // 1 hour
  });
  
  // Fetch detailed ability data for current page
  const { data: abilitiesData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['abilities-details', page, abilitiesList?.results],
    queryFn: async () => {
      if (!abilitiesList) return [];
      const promises = abilitiesList.results.map(ability => getAbility(ability.name));
      return Promise.all(promises);
    },
    enabled: !!abilitiesList,
    staleTime: 1000 * 60 * 60
  });
  
  const isLoading = isLoadingList || isLoadingDetails;
  
  // Filter abilities by search
  const filteredAbilities = abilitiesData?.filter(ability => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = ability.names.find(n => n.language.name === 'en')?.name.toLowerCase() || 
                 ability.name.toLowerCase();
    return name.includes(query);
  }) || [];
  
  const totalPages = abilitiesList ? Math.ceil(abilitiesList.count / ABILITIES_PER_PAGE) : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-4xl font-bold">Ability Atlas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Discover all Pokémon abilities with detailed effects and which Pokémon can have them.
        </p>
      </motion.div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search abilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Abilities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: ABILITIES_PER_PAGE }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAbilities.map((ability) => (
              <AbilityCard key={ability.id} ability={ability} />
            ))}
          </div>
          
          {filteredAbilities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No abilities found matching your search.
              </p>
            </div>
          )}
        </>
      )}
      
      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {page + 1} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1 || isLoading}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

