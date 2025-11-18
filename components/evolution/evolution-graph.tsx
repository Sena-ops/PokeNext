'use client';

import { EvolutionChain, EvolutionChainLink, EvolutionDetail } from '@/types/pokeapi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EvolutionGraphProps {
  evolutionChain: EvolutionChain;
}

export function EvolutionGraph({ evolutionChain }: EvolutionGraphProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <CardTitle className="text-2xl">Evolution Chain</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <EvolutionNode node={evolutionChain.chain} level={0} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EvolutionNode({ node, level }: { node: EvolutionChainLink; level: number }) {
  const speciesName = node.species.name;
  
  return (
    <div className="flex flex-col items-center">
      {/* Current Pokemon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: level * 0.2 }}
      >
        <Link href={`/pokemon/${speciesName}`}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow w-48">
            <CardContent className="p-4 text-center">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromUrl(node.species.url)}.png`}
                alt={speciesName}
                className="w-24 h-24 mx-auto mb-2"
              />
              <p className="font-semibold capitalize">{speciesName.replace(/-/g, ' ')}</p>
              {node.is_baby && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Baby
                </Badge>
              )}
            </CardContent>
          </Card>
        </Link>
      </motion.div>
      
      {/* Evolution branches */}
      {node.evolves_to.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          {node.evolves_to.map((evolution, index) => (
            <div key={index} className="flex items-center">
              {/* Evolution trigger */}
              <div className="flex flex-col items-center mx-4">
                <ArrowRight className="w-6 h-6 text-gray-400 mb-2" />
                <EvolutionTrigger details={evolution.evolution_details} />
              </div>
              
              {/* Next stage */}
              <div className={node.evolves_to.length > 1 ? 'mt-8' : ''}>
                <EvolutionNode node={evolution} level={level + 1} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvolutionTrigger({ details }: { details: EvolutionDetail[] }) {
  if (details.length === 0) return null;
  
  const detail = details[0];
  const triggers: string[] = [];
  
  if (detail.min_level) {
    triggers.push(`Lvl ${detail.min_level}`);
  }
  
  if (detail.item) {
    triggers.push(detail.item.name.replace(/-/g, ' '));
  }
  
  if (detail.trigger.name === 'trade') {
    triggers.push('Trade');
  }
  
  if (detail.min_happiness) {
    triggers.push(`Happiness ${detail.min_happiness}+`);
  }
  
  if (detail.known_move) {
    triggers.push(`Learn ${detail.known_move.name.replace(/-/g, ' ')}`);
  }
  
  if (detail.time_of_day) {
    triggers.push(detail.time_of_day.charAt(0).toUpperCase() + detail.time_of_day.slice(1));
  }
  
  if (detail.location) {
    triggers.push(`At ${detail.location.name.replace(/-/g, ' ')}`);
  }
  
  if (triggers.length === 0) {
    triggers.push(detail.trigger.name.replace(/-/g, ' '));
  }
  
  return (
    <div className="flex flex-col gap-1">
      {triggers.map((trigger, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-xs whitespace-nowrap capitalize"
        >
          {trigger}
        </Badge>
      ))}
    </div>
  );
}

function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
}

