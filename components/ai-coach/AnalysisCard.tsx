"use client";

import { motion } from 'framer-motion';
import { StrategyAnalysis } from '@/types/app';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Sword,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface AnalysisCardProps {
  analysis: StrategyAnalysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const scoreColor =
    analysis.teamScore >= 80
      ? 'text-green-500'
      : analysis.teamScore >= 60
      ? 'text-yellow-500'
      : 'text-red-500';

  const scoreGradient =
    analysis.teamScore >= 80
      ? 'from-green-500 to-emerald-600'
      : analysis.teamScore >= 60
      ? 'from-yellow-500 to-orange-600'
      : 'from-red-500 to-orange-600';

  // Prepare radar chart data
  const radarData = [
    { category: 'Ataque', value: analysis.strengths.length * 10 },
    { category: 'Defesa', value: Math.max(0, 100 - analysis.weaknesses.length * 15) },
    { category: 'Sinergia', value: analysis.synergies.length * 15 },
    {
      category: 'Roles',
      value:
        (analysis.roleBalance.physicalSweepers +
          analysis.roleBalance.specialSweepers +
          analysis.roleBalance.physicalTanks +
          analysis.roleBalance.specialTanks) *
        10,
    },
    { category: 'Cobertura', value: Math.min(100, analysis.strengths.length * 5) },
  ];

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`p-6 bg-gradient-to-br ${scoreGradient} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Pontuação do Time</p>
              <h2 className="text-5xl font-bold">{analysis.teamScore}/100</h2>
              <p className="text-sm mt-2 opacity-90">
                {analysis.teamScore >= 80
                  ? 'Time excelente! Muito bem balanceado.'
                  : analysis.teamScore >= 60
                  ? 'Time bom, mas há espaço para melhorias.'
                  : 'Time precisa de ajustes significativos.'}
              </p>
            </div>

            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.3)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: 'white', fontSize: 10 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="white"
                    fill="white"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold">Fraquezas</h3>
          </div>

          <div className="space-y-3">
            {analysis.weaknesses.slice(0, 5).map((weakness, index) => (
              <motion.div
                key={weakness.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={`${
                        weakness.severity === 'critical'
                          ? 'bg-red-600'
                          : weakness.severity === 'high'
                          ? 'bg-orange-500'
                          : weakness.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      } text-white`}
                    >
                      {weakness.severity}
                    </Badge>
                    <span className="font-bold capitalize">{weakness.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {weakness.count}/{weakness.affectedPokemon.length} Pokémon afetados:{' '}
                    {weakness.affectedPokemon.slice(0, 2).join(', ')}
                    {weakness.affectedPokemon.length > 2 && '...'}
                  </p>
                </div>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-bold">Pontos Fortes</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {analysis.strengths.slice(0, 6).map((strength, index) => (
              <motion.div
                key={strength.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-bold capitalize text-sm">{strength.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {strength.coverage} Pokémon
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Role Balance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-bold">Balanceamento de Roles</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sword className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Sweepers</span>
            </div>
            <p className="text-2xl font-bold">
              {analysis.roleBalance.physicalSweepers + analysis.roleBalance.specialSweepers}
            </p>
            <p className="text-xs text-muted-foreground">
              {analysis.roleBalance.physicalSweepers} físicos, {analysis.roleBalance.specialSweepers}{' '}
              especiais
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Tanks</span>
            </div>
            <p className="text-2xl font-bold">
              {analysis.roleBalance.physicalTanks + analysis.roleBalance.specialTanks}
            </p>
            <p className="text-xs text-muted-foreground">
              {analysis.roleBalance.physicalTanks} físicos, {analysis.roleBalance.specialTanks}{' '}
              especiais
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Speedsters</span>
            </div>
            <p className="text-2xl font-bold">{analysis.roleBalance.speedsters}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Outros</span>
            </div>
            <p className="text-2xl font-bold">
              {analysis.roleBalance.wallBreakers +
                analysis.roleBalance.supports +
                analysis.roleBalance.balanced}
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm">{analysis.roleBalance.recommendation}</p>
        </div>
      </Card>

      {/* Battle Strategy */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl font-bold">Estratégia de Batalha</h3>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line">{analysis.battleStrategy}</p>
        </div>
      </Card>

      {/* Synergies */}
      {analysis.synergies.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold">Sinergias Detectadas</h3>
          </div>

          <div className="space-y-2">
            {analysis.synergies.map((synergy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">
                    {synergy.pokemon1} ↔️ {synergy.pokemon2}
                  </span>
                  <Badge className="bg-yellow-500 text-white">+{synergy.score}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{synergy.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Counter Teams */}
      {analysis.counterTeams.length > 0 && (
        <Card className="p-6 border-orange-200 dark:border-orange-900">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-bold">Times Perigosos</h3>
          </div>

          <div className="space-y-3">
            {analysis.counterTeams.map((counter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{counter.name}</h4>
                  <Badge
                    className={`${
                      counter.dangerLevel === 'extreme'
                        ? 'bg-red-600'
                        : counter.dangerLevel === 'high'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    } text-white`}
                  >
                    {counter.dangerLevel}
                  </Badge>
                </div>
                <p className="text-sm mb-2">
                  <span className="font-medium">Pokémon comuns:</span>{' '}
                  {counter.commonPokemon.join(', ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Contra-estratégia:</span> {counter.counterStrategy}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
