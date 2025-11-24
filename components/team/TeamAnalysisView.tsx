'use client'

import { useTeamStore } from '@/store/team-store'
import { useTeamAnalysis } from '@/hooks/use-team-analysis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsRadar } from '@/components/analysis/stats-radar'
import { TeamScore } from '@/components/analysis/team-score'
import { TypeCoverageMatrix } from '@/components/analysis/type-coverage-matrix'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Shield, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TeamAnalysisView() {
  const { currentTeam } = useTeamStore()
  const analysis = useTeamAnalysis(currentTeam.filter(p => p !== null))

  if (currentTeam.filter(p => p !== null).length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-2">Nenhum Pokémon no time</p>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Adicione Pokémon ao seu time para ver a análise detalhada
          </p>
          <Link href="/team?tab=builder">
            <Button>Adicionar Pokémon</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Team Score */}
      <Card>
        <CardHeader>
          <CardTitle>Pontuação do Time</CardTitle>
          <CardDescription>Avaliação geral baseada em sinergia e cobertura</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis && <TeamScore analysis={analysis} />}
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Médias</CardTitle>
            <CardDescription>Distribuição de stats do time</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis && <StatsRadar stats={analysis.averageStats} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cobertura de Tipos</CardTitle>
            <CardDescription>Efetividade contra cada tipo</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis && <TypeCoverageMatrix coverage={analysis.coverage} />}
          </CardContent>
        </Card>
      </div>

      {/* Weaknesses */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle>Fraquezas do Time</CardTitle>
          </div>
          <CardDescription>Tipos que podem causar dano aumentado</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis && analysis.weaknesses && analysis.weaknesses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.weaknesses.map((weakness, index) => (
                <Badge key={index} variant="destructive">
                  {weakness}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma fraqueza crítica detectada</p>
          )}
        </CardContent>
      </Card>

      {/* Resistances */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <CardTitle>Resistências do Time</CardTitle>
          </div>
          <CardDescription>Tipos que causam dano reduzido</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis && analysis.resistances && analysis.resistances.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.resistances.map((resistance, index) => (
                <Badge key={index} variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                  {resistance}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma resistência significativa</p>
          )}
        </CardContent>
      </Card>

      {/* Offensive Coverage */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <CardTitle>Cobertura Ofensiva</CardTitle>
          </div>
          <CardDescription>Tipos que seu time pode atacar efetivamente</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis && analysis.offensiveCoverage && analysis.offensiveCoverage.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.offensiveCoverage.map((type, index) => (
                <Badge key={index} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Cobertura ofensiva limitada</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
