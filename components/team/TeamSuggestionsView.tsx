'use client'

import { useTeamStore } from '@/store/team-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export function TeamSuggestionsView() {
  const { currentTeam } = useTeamStore()
  const teamSize = currentTeam.filter(p => p !== null).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <CardTitle>Sugestões de IA</CardTitle>
          </div>
          <CardDescription>
            Use o AI Coach para receber recomendações inteligentes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="h-16 w-16 text-purple-500 mb-4" />
          <p className="text-lg font-medium mb-2">
            {teamSize === 0
              ? 'Adicione Pokémon ao seu time primeiro'
              : 'Use o AI Coach para análise detalhada'
            }
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            O AI Coach pode analisar seu time e sugerir melhorias
          </p>
          <Link href="/ai-coach">
            <Button disabled={teamSize === 0}>
              <Sparkles className="h-4 w-4 mr-2" />
              Ir para AI Coach
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
