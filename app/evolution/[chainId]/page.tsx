import { getEvolutionChain, getPokemonSpecies } from '@/lib/api/pokemon';
import { EvolutionGraph } from '@/components/evolution/evolution-graph';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EvolutionPageProps {
  params: {
    chainId: string;
  };
}

// Extract chain ID from evolution chain URL
function extractChainId(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
}

export async function generateMetadata({ params }: EvolutionPageProps) {
  try {
    // Try to get as pokemon name first
    const species = await getPokemonSpecies(params.chainId);
    const chainId = extractChainId(species.evolution_chain.url);
    const evolutionChain = await getEvolutionChain(chainId);
    return {
      title: `${species.name.charAt(0).toUpperCase() + species.name.slice(1)} Evolution Chain`,
      description: `View the evolution chain starting from ${evolutionChain.chain.species.name}`
    };
  } catch {
    // Fallback: try as chain ID
    try {
      const chainId = parseInt(params.chainId);
      const evolutionChain = await getEvolutionChain(chainId);
      return {
        title: `Evolution Chain #${chainId}`,
        description: `View the evolution chain starting from ${evolutionChain.chain.species.name}`
      };
    } catch {
      return {
        title: 'Evolution Chain Not Found'
      };
    }
  }
}

export default async function EvolutionPage({ params }: EvolutionPageProps) {
  let evolutionChain;
  let pokemonName: string | null = null;
  
  try {
    // First, try to get as Pokemon name (species)
    const species = await getPokemonSpecies(params.chainId);
    pokemonName = species.name;
    const chainId = extractChainId(species.evolution_chain.url);
    evolutionChain = await getEvolutionChain(chainId);
  } catch {
    // Fallback: try as chain ID directly
    try {
      const chainId = parseInt(params.chainId);
      if (isNaN(chainId)) {
        notFound();
      }
      evolutionChain = await getEvolutionChain(chainId);
    } catch (error) {
      notFound();
    }
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
        <Link href="/evolution">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Evolution Chains
          </Button>
        </Link>
      </div>
      
      <EvolutionGraph evolutionChain={evolutionChain} />
    </div>
  );
}

