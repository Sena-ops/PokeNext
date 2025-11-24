"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/store/app-store';
import { useTeamStore } from '@/store/team-store';
import { useAchievements } from '@/hooks/useAchievements';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Sparkles,
  Swords,
  Users,
  Cloud,
  Target,
  TrendingUp,
  Zap,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { userProfile, battleHistory, sharedTeams } = useAppStore();
  const { currentTeam, savedTeams } = useTeamStore();
  const { level, levelProgress, nextLevelXP, title, unlockedCount, totalCount } = useAchievements();

  const validTeam = currentTeam.filter((p) => p !== null);
  const recentBattles = battleHistory.slice(0, 5);
  const winRate = battleHistory.length > 0
    ? ((userProfile.stats.battlesWon / battleHistory.length) * 100).toFixed(1)
    : 0;

  const quickStats = [
    { label: 'Times Criados', value: userProfile.stats.teamsCreated, icon: Target, color: 'text-blue-500' },
    { label: 'Batalhas Vencidas', value: userProfile.stats.battlesWon, icon: Swords, color: 'text-red-500' },
    { label: 'Conquistas', value: `${unlockedCount}/${totalCount}`, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Times Compartilhados', value: userProfile.stats.sharedTeams, icon: Users, color: 'text-purple-500' },
  ];

  const quickActions = [
    { label: 'Team Builder', href: '/team-builder', icon: Target, color: 'bg-blue-500', description: 'Monte seu time' },
    { label: 'AI Coach', href: '/ai-coach', icon: Sparkles, color: 'bg-purple-500', description: 'Análise estratégica' },
    { label: 'Battle Sim', href: '/battle-sim', icon: Swords, color: 'bg-red-500', description: 'Simule batalhas' },
    { label: 'Social Hub', href: '/social-hub', icon: Users, color: 'bg-pink-500', description: 'Compartilhe times' },
    { label: 'Weather Events', href: '/weather-events', icon: Cloud, color: 'bg-cyan-500', description: 'Eventos climáticos' },
    { label: 'Conquistas', href: '/achievements', icon: Trophy, color: 'bg-yellow-500', description: 'Suas conquistas' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Bem-vindo de volta, {userProfile.name}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">{title}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-gradient-to-br from-pokemon-red/10 to-pokemon-yellow/10">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pokemon-red to-pokemon-yellow p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl">
                    {userProfile.avatar || '👤'}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-pokemon-yellow text-pokemon-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg border-4 border-background">
                  {level}
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
                <Badge className="bg-gradient-to-r from-pokemon-red to-pokemon-yellow text-white mb-3">
                  {title}
                </Badge>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nível {level}</span>
                    <span className="font-bold">{userProfile.xp} / {nextLevelXP} XP</span>
                  </div>
                  <Progress value={levelProgress} className="h-3" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="bg-background/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weather Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <WeatherWidget />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className={`w-12 h-12 rounded-full ${action.color} text-white flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Team */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Time Atual</h3>
              <Link href="/team-builder">
                <Button variant="ghost" size="sm" className="gap-2">
                  Editar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {validTeam.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {validTeam.map((pokemon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="aspect-square bg-muted rounded-lg p-2 flex flex-col items-center justify-center"
                  >
                    <img
                      src={pokemon!.sprites.front_default}
                      alt={pokemon!.name}
                      className="w-16 h-16 mb-1"
                    />
                    <p className="text-xs font-medium capitalize text-center">{pokemon!.name}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum time montado</p>
                <Link href="/team-builder">
                  <Button className="mt-3" size="sm">Criar Time</Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Battle History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Histórico de Batalhas</h3>
              <Badge variant="secondary">
                {winRate}% vitórias
              </Badge>
            </div>

            {recentBattles.length > 0 ? (
              <div className="space-y-2">
                {recentBattles.map((battle) => (
                  <div
                    key={battle.id}
                    className={`p-3 rounded-lg border ${
                      battle.winner === 'team1'
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {battle.winner === 'team1' ? (
                          <Badge className="bg-green-500 text-white">Vitória</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">Derrota</Badge>
                        )}
                        <span className="text-sm font-medium">{battle.team2Name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {battle.turns} turnos
                      </span>
                    </div>
                  </div>
                ))}

                <Link href="/battle-sim">
                  <Button variant="outline" className="w-full mt-2">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Swords className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma batalha ainda</p>
                <Link href="/battle-sim">
                  <Button className="mt-3" size="sm">Iniciar Batalha</Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Atividade Recente
          </h3>

          <div className="space-y-3">
            {userProfile.stats.teamsCreated > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Times criados</p>
                  <p className="text-muted-foreground">{userProfile.stats.teamsCreated} times no total</p>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {userProfile.stats.battlesWon > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Swords className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Batalhas vencidas</p>
                  <p className="text-muted-foreground">{userProfile.stats.battlesWon} vitórias</p>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {unlockedCount > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Conquistas desbloqueadas</p>
                  <p className="text-muted-foreground">{unlockedCount} de {totalCount}</p>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {userProfile.stats.sharedTeams > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Times compartilhados</p>
                  <p className="text-muted-foreground">{userProfile.stats.sharedTeams} times</p>
                </div>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            )}

            {userProfile.stats.teamsCreated === 0 && userProfile.stats.battlesWon === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Comece sua jornada criando um time!</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
