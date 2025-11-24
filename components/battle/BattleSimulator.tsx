"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTeamStore } from '@/store/team-store';
import { useAppStore } from '@/store/app-store';
import { BattleEngine } from '@/lib/battle/battle-engine';
import { BattleState, BattlePokemon } from '@/types/app';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Swords, Zap, Shield, Play, RotateCcw, FastForward } from 'lucide-react';

export function BattleSimulator() {
  const { currentTeam } = useTeamStore();
  const { addBattle } = useAppStore();
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  const validTeam = currentTeam.filter((p) => p !== null);

  const startBattle = () => {
    if (validTeam.length === 0) return;

    // Initialize battle with current team vs random opponent
    const team1 = validTeam.map((p) => BattleEngine.initializeBattlePokemon(p!));
    const team2 = validTeam.map((p) => BattleEngine.initializeBattlePokemon(p!)); // Simplified: use same team

    const initialState: BattleState = {
      id: Date.now().toString(),
      team1,
      team2,
      currentTurn: 1,
      activeIndex1: 0,
      activeIndex2: 0,
      log: [],
      speed: 1,
    };

    setBattleState(initialState);
  };

  const simulateTurn = () => {
    if (!battleState || battleState.result) return;

    const pokemon1 = battleState.team1[battleState.activeIndex1];
    const pokemon2 = battleState.team2[battleState.activeIndex2];

    if (!pokemon1 || !pokemon2) return;

    // Get random moves
    const move1 = pokemon1.moves[Math.floor(Math.random() * pokemon1.moves.length)];
    const move2 = pokemon2.moves[Math.floor(Math.random() * pokemon2.moves.length)];

    const newState = BattleEngine.simulateTurn(battleState, move1, move2);
    setBattleState(newState);

    if (newState.result) {
      // Battle ended
      addBattle({
        id: newState.id,
        team1Name: 'Seu Time',
        team2Name: 'Oponente',
        winner: newState.result,
        turns: newState.currentTurn,
        date: new Date().toISOString(),
      });
    }
  };

  const autoSimulate = async () => {
    setIsSimulating(true);

    while (battleState && !battleState.result) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / speed));
      simulateTurn();
    }

    setIsSimulating(false);
  };

  const reset = () => {
    setBattleState(null);
    setIsSimulating(false);
  };

  if (validTeam.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Swords className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-bold mb-2">Nenhum time disponível</h3>
        <p className="text-muted-foreground">Adicione Pokémon ao seu time para começar a simular batalhas!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {!battleState ? (
              <Button onClick={startBattle} size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Iniciar Batalha
              </Button>
            ) : (
              <>
                <Button onClick={simulateTurn} disabled={!!battleState.result || isSimulating} className="gap-2">
                  <Zap className="w-4 h-4" />
                  Próximo Turno
                </Button>
                <Button onClick={autoSimulate} disabled={!!battleState.result || isSimulating} variant="secondary" className="gap-2">
                  <FastForward className="w-4 h-4" />
                  Auto Simular
                </Button>
                <Button onClick={reset} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reiniciar
                </Button>
              </>
            )}
          </div>

          {battleState && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Velocidade:</span>
              {[1, 2, 4].map((s) => (
                <Button
                  key={s}
                  variant={speed === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSpeed(s as 1 | 2 | 4)}
                >
                  {s}x
                </Button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {battleState && (
        <>
          {/* Battle Arena */}
          <div className="grid grid-cols-2 gap-6">
            {/* Team 1 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Seu Time</h3>
                <Badge variant="secondary">Time 1</Badge>
              </div>

              <div className="space-y-4">
                {battleState.team1.map((pokemon, index) => (
                  <PokemonBattleCard
                    key={index}
                    pokemon={pokemon}
                    isActive={index === battleState.activeIndex1}
                  />
                ))}
              </div>
            </Card>

            {/* Team 2 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Oponente</h3>
                <Badge variant="destructive">Time 2</Badge>
              </div>

              <div className="space-y-4">
                {battleState.team2.map((pokemon, index) => (
                  <PokemonBattleCard
                    key={index}
                    pokemon={pokemon}
                    isActive={index === battleState.activeIndex2}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Battle Log */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Log da Batalha</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {battleState.log.slice().reverse().map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg ${
                    entry.type === 'faint'
                      ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                      : entry.type === 'damage'
                      ? 'bg-orange-50 dark:bg-orange-950/20'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{entry.message}</span>
                    <Badge variant="outline">Turno {entry.turn}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Battle Result */}
          {battleState.result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className={`p-8 text-center ${
                battleState.result === 'team1'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-red-500 to-orange-600'
              } text-white`}>
                <h2 className="text-4xl font-bold mb-2">
                  {battleState.result === 'team1' ? '🎉 Vitória!' : '😔 Derrota'}
                </h2>
                <p className="text-xl mb-4">
                  {battleState.result === 'team1' ? 'Seu time venceu' : 'Seu time perdeu'} em {battleState.currentTurn} turnos!
                </p>
                <Button onClick={reset} variant="secondary" size="lg">
                  Nova Batalha
                </Button>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function PokemonBattleCard({ pokemon, isActive }: { pokemon: BattlePokemon; isActive: boolean }) {
  const hpPercentage = (pokemon.currentHP / pokemon.maxHP) * 100;

  return (
    <motion.div
      animate={isActive ? { scale: 1.05, borderColor: '#fbbf24' } : { scale: 1 }}
      className={`p-4 rounded-lg border-2 ${isActive ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' : 'border-transparent bg-muted'}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-12 h-12"
        />
        <div className="flex-1">
          <h4 className="font-bold capitalize">{pokemon.name}</h4>
          <div className="flex gap-1">
            {pokemon.types.map((type) => (
              <Badge key={type.type.name} variant="secondary" className="text-xs">
                {type.type.name}
              </Badge>
            ))}
          </div>
        </div>
        {isActive && <Zap className="w-5 h-5 text-yellow-500" />}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>HP</span>
          <span className="font-bold">
            {pokemon.currentHP}/{pokemon.maxHP}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {pokemon.currentHP === 0 && (
        <div className="mt-2 text-center text-sm font-bold text-red-500">Desmaiado</div>
      )}
    </motion.div>
  );
}
