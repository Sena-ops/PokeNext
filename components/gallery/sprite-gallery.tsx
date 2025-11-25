'use client';

import { Pokemon } from '@/types/pokemon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface SpriteGalleryProps {
  pokemon: Pokemon;
}

interface SpriteItem {
  url: string | null | undefined;
  label: string;
  category: string;
}

export function SpriteGallery({ pokemon }: SpriteGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('official');
  
  const sprites: SpriteItem[] = [
    // Official Artwork
    {
      url: pokemon.sprites.other?.['official-artwork']?.front_default,
      label: 'Official Artwork',
      category: 'official'
    },
    // Game Sprites
    {
      url: pokemon.sprites.front_default,
      label: 'Front Default',
      category: 'game'
    },
    {
      url: pokemon.sprites.front_shiny,
      label: 'Front Shiny',
      category: 'game'
    },
    {
      url: pokemon.sprites.back_default,
      label: 'Back Default',
      category: 'game'
    },
    {
      url: pokemon.sprites.back_shiny,
      label: 'Back Shiny',
      category: 'game'
    },
    {
      url: pokemon.sprites.front_female,
      label: 'Front Female',
      category: 'game'
    },
    {
      url: pokemon.sprites.front_shiny_female,
      label: 'Front Shiny Female',
      category: 'game'
    },
    // Showdown
    {
      url: pokemon.sprites.other?.showdown?.front_default,
      label: 'Showdown',
      category: 'showdown'
    },
    {
      url: pokemon.sprites.other?.showdown?.front_shiny,
      label: 'Showdown Shiny',
      category: 'showdown'
    },
  ].filter(sprite => sprite.url !== null);
  
  const categories = Array.from(new Set(sprites.map(s => s.category)));
  const filteredSprites = selectedCategory === 'all' 
    ? sprites 
    : sprites.filter(s => s.category === selectedCategory);
  
  const handleDownload = (url: string, label: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pokemon.name}-${label.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl">Sprite Gallery</CardTitle>
          </div>
          <Badge variant="secondary">
            {filteredSprites.length} sprites
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        {/* Sprite Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSprites.map((sprite, index) => (
            <motion.div
              key={`${sprite.label}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                  <img
                    src={sprite.url!}
                    alt={sprite.label}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium text-center">
                    {sprite.label}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownload(sprite.url!, sprite.label)}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

