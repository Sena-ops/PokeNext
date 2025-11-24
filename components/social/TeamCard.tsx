"use client";

import { motion } from 'framer-motion';
import { SharedTeam } from '@/types/app';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Share2, Trophy } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { useTeamStore } from '@/store/team-store';

interface TeamCardProps {
  team: SharedTeam;
  index: number;
}

export function TeamCard({ team, index }: TeamCardProps) {
  const { userProfile, toggleTeamVote, teamVotes } = useAppStore();
  const { currentTeam } = useTeamStore();

  const hasLiked = teamVotes.some(
    (v) => v.teamId === team.id && v.userId === userProfile.id && v.type === 'like'
  );

  const handleLike = () => {
    toggleTeamVote(team.id, 'like');
  };

  const handleTryTeam = () => {
    // Load this team into the team builder (simplified)
    alert('Feature: Carregar este time no Team Builder');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all">
        {/* Header */}
        <div className="p-4 bg-gradient-to-br from-pokemon-red to-pokemon-yellow">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
              <p className="text-sm text-white/90">por {team.author}</p>
            </div>
            {team.featured && (
              <Badge className="bg-yellow-400 text-pokemon-black">
                <Trophy className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className="p-4 bg-muted/30">
          <div className="grid grid-cols-6 gap-2">
            {team.pokemon.map((pokemon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="aspect-square bg-background rounded-lg p-1 border-2 border-transparent hover:border-pokemon-yellow transition-all"
              >
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-full h-full object-contain"
                  title={pokemon.name}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {team.description || 'Sem descrição'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {team.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{team.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{team.views}</span>
            </div>
            <span className="ml-auto text-xs">
              {new Date(team.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant={hasLiked ? 'default' : 'outline'}
              size="sm"
              onClick={handleLike}
              className="flex-1 gap-2"
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              {hasLiked ? 'Curtido' : 'Curtir'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleTryTeam} className="flex-1">
              Experimentar
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
