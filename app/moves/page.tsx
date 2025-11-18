'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listMoves, getMove } from '@/lib/api/pokemon';
import { MoveCard } from '@/components/moves/move-card';
import { MoveFiltersComponent, MoveFilters } from '@/components/moves/move-filters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, BookOpen, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MOVES_PER_PAGE = 20;

export default function MovesPage() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<MoveFilters>({
    search: '',
    type: null,
    damageClass: null,
    minPower: null
  });
  
  // Fetch moves list
  const { data: movesList, isLoading: isLoadingList } = useQuery({
    queryKey: ['moves-list', page],
    queryFn: () => listMoves(MOVES_PER_PAGE, page * MOVES_PER_PAGE),
    staleTime: 1000 * 60 * 60 // 1 hour
  });
  
  // Fetch detailed move data for current page
  const { data: movesData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['moves-details', page, movesList?.results],
    queryFn: async () => {
      if (!movesList) return [];
      const promises = movesList.results.map(move => getMove(move.name));
      return Promise.all(promises);
    },
    enabled: !!movesList,
    staleTime: 1000 * 60 * 60
  });
  
  const isLoading = isLoadingList || isLoadingDetails;
  
  // Filter moves
  const filteredMoves = movesData?.filter(move => {
    if (filters.search && !move.name.includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type && move.type.name !== filters.type) {
      return false;
    }
    if (filters.damageClass && move.damage_class.name !== filters.damageClass) {
      return false;
    }
    if (filters.minPower && (!move.power || move.power < filters.minPower)) {
      return false;
    }
    return true;
  }) || [];
  
  const totalPages = movesList ? Math.ceil(movesList.count / MOVES_PER_PAGE) : 0;
  
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
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold">Move Encyclopedia</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Explore all Pokémon moves with detailed information about power, accuracy, and effects.
        </p>
      </motion.div>
      
      {/* Filters */}
      <div className="mb-6">
        <MoveFiltersComponent filters={filters} onFiltersChange={setFilters} />
      </div>
      
      {/* Moves Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: MOVES_PER_PAGE }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMoves.map((move) => (
              <MoveCard key={move.id} move={move} showLearnedBy />
            ))}
          </div>
          
          {filteredMoves.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No moves found matching your filters.
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

