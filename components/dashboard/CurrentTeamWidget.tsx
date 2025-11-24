'use client'

import { useTeamStore } from '@/store/team-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getTypeColor } from '@/lib/constants/pokemon-types'

export function CurrentTeamWidget({ className }: { className?: string }) {
  const { currentTeam } = useTeamStore()

  const team = currentTeam.filter(p => p !== null)
  const emptySlots = 6 - team.length

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Meu Time Atual</CardTitle>
          <CardDescription>
            {team.length}/6 Pokémon no time
          </CardDescription>
        </div>
        <Link href="/team">
          <Button variant="ghost" size="sm">
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {team.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Seu time está vazio</p>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando seu primeiro Pokémon
            </p>
            <Link href="/team">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Pokémon
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {team.map((pokemon, index) => (
              <div
                key={index}
                className="group relative rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="aspect-square relative mb-2">
                  <Image
                    src={pokemon.sprites?.front_default || '/placeholder-pokemon.png'}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="font-medium capitalize text-center truncate mb-2">
                  {pokemon.name}
                </h4>
                <div className="flex gap-1 justify-center">
                  {pokemon.types.map((typeSlot, typeIndex) => (
                    <span
                      key={typeIndex}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full text-white",
                        getTypeColor(typeSlot.type.name as any)
                      )}
                    >
                      {typeSlot.type.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {Array.from({ length: emptySlots }).map((_, index) => (
              <Link key={`empty-${index}`} href="/team">
                <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30 transition-all cursor-pointer flex items-center justify-center group">
                  <Plus className="h-8 w-8 text-muted-foreground group-hover:scale-110 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
