import { getPokemon } from '@/lib/api/pokemon';
import { SpriteGallery } from '@/components/gallery/sprite-gallery';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

interface GalleryPageProps {
  params: {
    pokemon: string;
  };
}

export async function generateMetadata({ params }: GalleryPageProps) {
  try {
    const pokemon = await getPokemon(params.pokemon);
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} Gallery`,
      description: `View all sprites and artwork for ${pokemon.name}`
    };
  } catch {
    return {
      title: 'Gallery Not Found'
    };
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  let pokemon;
  
  try {
    pokemon = await getPokemon(params.pokemon);
  } catch (error) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
        <Link href="/gallery">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Galeria
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold capitalize mb-2">
          {pokemon.name.replace(/-/g, ' ')} Gallery
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          All available sprites and artwork variations
        </p>
      </div>
      
      <SpriteGallery pokemon={pokemon} />
    </div>
  );
}

