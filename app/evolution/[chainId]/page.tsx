import { getEvolutionChain } from '@/lib/api/pokemon';
import { EvolutionGraph } from '@/components/evolution/evolution-graph';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EvolutionPageProps {
  params: {
    chainId: string;
  };
}

export async function generateMetadata({ params }: EvolutionPageProps) {
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

export default async function EvolutionPage({ params }: EvolutionPageProps) {
  const chainId = parseInt(params.chainId);
  
  if (isNaN(chainId)) {
    notFound();
  }
  
  let evolutionChain;
  
  try {
    evolutionChain = await getEvolutionChain(chainId);
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
      </div>
      
      <EvolutionGraph evolutionChain={evolutionChain} />
    </div>
  );
}

