import { getPokemon, getPokemonSpecies } from '@/lib/api/pokemon';
import { FlavorPanel } from '@/components/flavor/flavor-panel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

interface FlavorPageProps {
  params: {
    pokemon: string;
  };
}

export async function generateMetadata({ params }: FlavorPageProps) {
  try {
    const pokemon = await getPokemon(params.pokemon);
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} Lore`,
      description: `Pokédex entries and lore for ${pokemon.name}`
    };
  } catch {
    return {
      title: 'Lore Not Found'
    };
  }
}

export default async function FlavorPage({ params }: FlavorPageProps) {
  let pokemon, species;
  
  try {
    [pokemon, species] = await Promise.all([
      getPokemon(params.pokemon),
      getPokemonSpecies(params.pokemon)
    ]);
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
        <Link href="/flavor">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lore Hub
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32"
        />
        <div>
          <h1 className="text-4xl font-bold capitalize mb-2">
            {pokemon.name.replace(/-/g, ' ')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Pokédex #{species.id}
          </p>
        </div>
      </div>
      
      <FlavorPanel species={species} />
    </div>
  );
}

