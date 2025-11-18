import { getMove } from '@/lib/api/pokemon';
import { MoveDetail } from '@/components/moves/move-detail';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

interface MovePageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: MovePageProps) {
  try {
    const move = await getMove(params.name);
    return {
      title: `${move.name.charAt(0).toUpperCase() + move.name.slice(1).replace(/-/g, ' ')} - Move Details`,
      description: move.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'Pokémon move details'
    };
  } catch {
    return {
      title: 'Move Not Found'
    };
  }
}

export default async function MovePage({ params }: MovePageProps) {
  let move;
  
  try {
    move = await getMove(params.name);
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
        <Link href="/moves">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Moves
          </Button>
        </Link>
      </div>
      
      <MoveDetail move={move} />
    </div>
  );
}

