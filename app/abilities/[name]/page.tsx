import { getAbility } from '@/lib/api/pokemon';
import { AbilityDetail } from '@/components/abilities/ability-detail';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { notFound } from 'next/navigation';

interface AbilityPageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: AbilityPageProps) {
  try {
    const ability = await getAbility(params.name);
    const displayName = ability.names.find(n => n.language.name === 'en')?.name || ability.name;
    return {
      title: `${displayName} - Ability Details`,
      description: ability.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'Pokémon ability details'
    };
  } catch {
    return {
      title: 'Ability Not Found'
    };
  }
}

export default async function AbilityPage({ params }: AbilityPageProps) {
  let ability;
  
  try {
    ability = await getAbility(params.name);
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
        <Link href="/abilities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Abilities
          </Button>
        </Link>
      </div>
      
      <AbilityDetail ability={ability} />
    </div>
  );
}

