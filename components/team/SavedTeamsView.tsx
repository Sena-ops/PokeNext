'use client'

import { useTeamStore } from '@/store/team-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { getTypeColor } from '@/lib/constants/pokemon-types'
import { cn } from '@/lib/utils'

export function SavedTeamsView() {
  const { savedTeams, loadTeam, deleteTeam } = useTeamStore()

  const handleLoadTeam = (teamId: string) => {
    loadTeam(teamId)
    alert('Time carregado com sucesso!')
  }

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Tem certeza que deseja excluir este time?')) {
      deleteTeam(teamId)
    }
  }

  if (savedTeams.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Save className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-2">Nenhum time salvo</p>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Crie e salve seus times para acessá-los rapidamente
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {savedTeams.map((team) => (
        <Card key={team.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  {new Date(team.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLoadTeam(team.id)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Carregar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {team.pokemon.map((pokemon, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border border-border bg-card p-3 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={pokemon.sprites?.front_default || '/placeholder-pokemon.png'}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs font-medium capitalize text-center truncate mb-1">
                    {pokemon.name}
                  </p>
                  <div className="flex gap-1 justify-center">
                    {pokemon.types.map((typeSlot, typeIndex) => (
                      <span
                        key={typeIndex}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full text-white",
                          getTypeColor(typeSlot.type.name as any)
                        )}
                      >
                        {typeSlot.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
