import { getPokemon, getPokemonEncounters, getPokemonSpecies } from '@/lib/api/pokemon';
import { EncounterMapCard } from '@/components/encounters/encounter-map-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, MapPin, Info, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EncounterExplorerPageProps {
  params: {
    pokemon: string;
  };
}

export async function generateMetadata({ params }: EncounterExplorerPageProps) {
  try {
    const pokemon = await getPokemon(params.pokemon);
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} Encounters`,
      description: `Find where to encounter ${pokemon.name} in different Pokémon games`
    };
  } catch {
    return {
      title: 'Encounters Not Found'
    };
  }
}

export default async function EncounterExplorerPage({ params }: EncounterExplorerPageProps) {
  let pokemon, encounters, species;
  
  try {
    [pokemon, encounters, species] = await Promise.all([
      getPokemon(params.pokemon),
      getPokemonEncounters(params.pokemon),
      getPokemonSpecies(params.pokemon)
    ]);
  } catch (error) {
    notFound();
  }
  
  const habitat = species.habitat?.name.replace(/-/g, ' ');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
        <Link href="/explorer/encounters">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Explorer
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32"
          />
          <div>
            <h1 className="text-4xl font-bold capitalize mb-2">
              {pokemon.name.replace(/-/g, ' ')} Encounters
            </h1>
            {habitat && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  Habitat: {habitat}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Encounters */}
      {encounters.length === 0 ? (
        <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
          <Info className="w-12 h-12 mx-auto mb-4 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-xl font-semibold mb-2">No Wild Encounters</h3>
          <p className="text-gray-600 dark:text-gray-400">
            This Pokémon cannot be found in the wild. It may be obtained through:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge>Evolution</Badge>
            <Badge>Breeding</Badge>
            <Badge>Special Events</Badge>
            <Badge>Trading</Badge>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Encounter Locations</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Found in {encounters.length} location{encounters.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {encounters.map((encounter, index) => (
              <EncounterMapCard key={index} encounter={encounter} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

