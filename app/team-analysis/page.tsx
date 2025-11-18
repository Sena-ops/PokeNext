"use client";

import { motion } from 'framer-motion';
import { useTeamStore } from '@/store/team-store';
import { useTeamAnalysis } from '@/hooks/use-team-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsRadar } from '@/components/analysis/stats-radar';
import { TeamScore } from '@/components/analysis/team-score';
import { TypeCoverageMatrix } from '@/components/analysis/type-coverage-matrix';
import { TypeBadge } from '@/components/pokemon/type-badge';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPokemonName } from '@/lib/utils';

export default function TeamAnalysisPage() {
  const { currentTeam } = useTeamStore();
  const analysis = useTeamAnalysis();

  const hasTeam = currentTeam.some((p) => p !== null);

  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-pokemon-red/10 py-8">
        <div className="container mx-auto px-4">
          <Link href="/team-builder">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <Card className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-4">Nenhum Time para Analisar</h2>
            <p className="text-muted-foreground mb-6">
              Você precisa construir um time primeiro antes de analisá-lo.
            </p>
            <Link href="/team-builder">
              <Button size="lg">Construir Time</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pokemon-red/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/team-builder">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Team Builder
            </Button>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Análise de Time
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Análise detalhada da sinergia e cobertura do seu time
          </p>
        </div>

        {/* Team Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Seu Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {currentTeam.map((pokemon, index) => (
                <div key={index}>
                  {pokemon ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-2">
                        <Image
                          src={pokemon.sprites.front_default}
                          alt={pokemon.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-sm font-semibold capitalize text-center">
                        {formatPokemonName(pokemon.name)}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {pokemon.types.map((type) => (
                          <span
                            key={type.slot}
                            className={`type-${type.type.name} px-2 py-0.5 rounded text-xs text-white uppercase font-bold`}
                          >
                            {type.type.name.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Synergy Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Score de Sinergia</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TeamScore score={analysis.synergyScore} />
          </CardContent>
        </Card>

        {/* Stats Radar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stats Médias do Time</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsRadar stats={analysis.averageStats} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {Object.entries(analysis.averageStats).map(([stat, value]) => (
                <div key={stat} className="text-center">
                  <p className="text-sm text-muted-foreground capitalize">
                    {stat === 'specialAttack' ? 'Atq. Esp.' : 
                     stat === 'specialDefense' ? 'Def. Esp.' :
                     stat === 'hp' ? 'HP' :
                     stat === 'attack' ? 'Ataque' :
                     stat === 'defense' ? 'Defesa' : 'Velocidade'}
                  </p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Type Coverage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Matriz de Cobertura de Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeCoverageMatrix
              coverage={analysis.offensiveCoverage}
              weaknesses={analysis.defensiveWeaknesses}
            />
          </CardContent>
        </Card>

        {/* Critical Weaknesses */}
        {analysis.criticalWeaknesses.length > 0 && (
          <Card className="mb-8 border-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Fraquezas Críticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Seu time tem vulnerabilidades significativas aos seguintes tipos:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.criticalWeaknesses.map((type) => (
                  <TypeBadge key={type} type={type} className="text-base px-4 py-2" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.criticalWeaknesses.length > 0 ? (
                <>
                  <p className="text-muted-foreground">
                    Considere adicionar Pokémon que resistam aos seguintes tipos para equilibrar seu time:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.criticalWeaknesses.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-green-500">
                  ✓ Seu time tem boa cobertura defensiva! Continue assim.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

