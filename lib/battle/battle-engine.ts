import { BattlePokemon, BattleState, BattleLogEntry, DamageCalculation, Move } from '@/types/app';
import { Pokemon, PokemonType } from '@/types/pokemon';

const typeEffectiveness: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export class BattleEngine {
  static initializeBattlePokemon(pokemon: Pokemon, moves?: Move[]): BattlePokemon {
    const maxHP = pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 100;

    return {
      ...pokemon,
      currentHP: maxHP,
      maxHP,
      moves: moves || this.getDefaultMoves(pokemon),
      statModifiers: {
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
        accuracy: 0,
        evasion: 0,
      },
    };
  }

  static getDefaultMoves(pokemon: Pokemon): Move[] {
    // Generate placeholder moves based on Pokemon types
    const types = pokemon.types.map((t) => t.type.name);
    const primaryType = types[0] as PokemonType;

    const moveSets: Record<string, Move[]> = {
      fire: [
        { id: 1, name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, pp: 15, priority: 0, damageClass: 'special', category: 'special' },
        { id: 2, name: 'Fire Blast', type: 'fire', power: 110, accuracy: 85, pp: 5, priority: 0, damageClass: 'special', category: 'special' },
      ],
      water: [
        { id: 3, name: 'Hydro Pump', type: 'water', power: 110, accuracy: 80, pp: 5, priority: 0, damageClass: 'special', category: 'special' },
        { id: 4, name: 'Surf', type: 'water', power: 90, accuracy: 100, pp: 15, priority: 0, damageClass: 'special', category: 'special' },
      ],
      grass: [
        { id: 5, name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, pp: 10, priority: 0, damageClass: 'special', category: 'special' },
        { id: 6, name: 'Leaf Storm', type: 'grass', power: 130, accuracy: 90, pp: 5, priority: 0, damageClass: 'special', category: 'special' },
      ],
      electric: [
        { id: 7, name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 15, priority: 0, damageClass: 'special', category: 'special' },
        { id: 8, name: 'Thunder', type: 'electric', power: 110, accuracy: 70, pp: 10, priority: 0, damageClass: 'special', category: 'special' },
      ],
    };

    const defaultMoves: Move[] = [
      { id: 99, name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, priority: 0, damageClass: 'physical', category: 'physical' },
      { id: 100, name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 30, priority: 1, damageClass: 'physical', category: 'physical' },
    ];

    return moveSets[primaryType] || defaultMoves;
  }

  static calculateDamage(
    attacker: BattlePokemon,
    defender: BattlePokemon,
    move: Move,
    weather?: BattleState['weather']
  ): DamageCalculation {
    if (!move.power) {
      return { damage: 0, isCritical: false, effectiveness: 1, hasSTAB: false };
    }

    // Get stats
    const attackStat = move.damageClass === 'physical'
      ? attacker.stats.find((s) => s.stat.name === 'attack')?.base_stat || 50
      : attacker.stats.find((s) => s.stat.name === 'special-attack')?.base_stat || 50;

    const defenseStat = move.damageClass === 'physical'
      ? defender.stats.find((s) => s.stat.name === 'defense')?.base_stat || 50
      : defender.stats.find((s) => s.stat.name === 'special-defense')?.base_stat || 50;

    // Critical hit (6.25% chance)
    const isCritical = Math.random() < 0.0625;
    const criticalMultiplier = isCritical ? 1.5 : 1;

    // STAB (Same Type Attack Bonus)
    const hasSTAB = attacker.types.some((t) => t.type.name === move.type);
    const stabMultiplier = hasSTAB ? 1.5 : 1;

    // Type effectiveness
    const effectiveness = this.getTypeEffectiveness(move.type as PokemonType, defender);

    // Random factor (0.85 to 1.0)
    const randomFactor = 0.85 + Math.random() * 0.15;

    // Weather effects
    let weatherMultiplier = 1;
    if (weather === 'rain' && move.type === 'water') weatherMultiplier = 1.5;
    if (weather === 'rain' && move.type === 'fire') weatherMultiplier = 0.5;
    if (weather === 'sun' && move.type === 'fire') weatherMultiplier = 1.5;
    if (weather === 'sun' && move.type === 'water') weatherMultiplier = 0.5;

    // Damage formula (simplified Gen 5+)
    const baseDamage = ((2 * 50 / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2;
    const damage = Math.floor(
      baseDamage * criticalMultiplier * stabMultiplier * effectiveness * weatherMultiplier * randomFactor
    );

    return {
      damage: Math.max(1, damage),
      isCritical,
      effectiveness,
      hasSTAB,
    };
  }

  static getTypeEffectiveness(moveType: PokemonType, defender: BattlePokemon): number {
    let effectiveness = 1;

    defender.types.forEach((type) => {
      const defenderType = type.type.name;
      const typeChart = typeEffectiveness[moveType];

      if (typeChart && typeChart[defenderType] !== undefined) {
        effectiveness *= typeChart[defenderType];
      }
    });

    return effectiveness;
  }

  static simulateTurn(state: BattleState, move1: Move, move2: Move): BattleState {
    const newState = { ...state };
    const pokemon1 = newState.team1[newState.activeIndex1];
    const pokemon2 = newState.team2[newState.activeIndex2];

    if (!pokemon1 || !pokemon2) return newState;

    // Determine move order (priority, then speed)
    const speed1 = pokemon1.stats.find((s) => s.stat.name === 'speed')?.base_stat || 50;
    const speed2 = pokemon2.stats.find((s) => s.stat.name === 'speed')?.base_stat || 50;

    let firstAttacker: BattlePokemon, secondAttacker: BattlePokemon;
    let firstMove: Move, secondMove: Move;
    let firstIsTeam1: boolean;

    if (move1.priority > move2.priority || (move1.priority === move2.priority && speed1 >= speed2)) {
      firstAttacker = pokemon1;
      secondAttacker = pokemon2;
      firstMove = move1;
      secondMove = move2;
      firstIsTeam1 = true;
    } else {
      firstAttacker = pokemon2;
      secondAttacker = pokemon1;
      firstMove = move2;
      secondMove = move1;
      firstIsTeam1 = false;
    }

    // First attack
    const damageCalc1 = this.calculateDamage(firstAttacker, secondAttacker, firstMove, state.weather);
    secondAttacker.currentHP = Math.max(0, secondAttacker.currentHP - damageCalc1.damage);

    newState.log.push({
      turn: newState.currentTurn,
      timestamp: new Date().toISOString(),
      type: 'move',
      message: `${firstAttacker.name} usou ${firstMove.name}!`,
      pokemon: firstAttacker.name,
      move: firstMove.name,
    });

    newState.log.push({
      turn: newState.currentTurn,
      timestamp: new Date().toISOString(),
      type: 'damage',
      message: this.getDamageMessage(damageCalc1),
      damage: damageCalc1.damage,
    });

    // Check if second Pokemon fainted
    if (secondAttacker.currentHP === 0) {
      newState.log.push({
        turn: newState.currentTurn,
        timestamp: new Date().toISOString(),
        type: 'faint',
        message: `${secondAttacker.name} desmaiou!`,
        pokemon: secondAttacker.name,
      });

      // Check for battle end
      const team = firstIsTeam1 ? newState.team2 : newState.team1;
      const allFainted = team.every((p) => p.currentHP === 0);

      if (allFainted) {
        newState.result = firstIsTeam1 ? 'team1' : 'team2';
        return newState;
      }

      return newState;
    }

    // Second attack
    const damageCalc2 = this.calculateDamage(secondAttacker, firstAttacker, secondMove, state.weather);
    firstAttacker.currentHP = Math.max(0, firstAttacker.currentHP - damageCalc2.damage);

    newState.log.push({
      turn: newState.currentTurn,
      timestamp: new Date().toISOString(),
      type: 'move',
      message: `${secondAttacker.name} usou ${secondMove.name}!`,
      pokemon: secondAttacker.name,
      move: secondMove.name,
    });

    newState.log.push({
      turn: newState.currentTurn,
      timestamp: new Date().toISOString(),
      type: 'damage',
      message: this.getDamageMessage(damageCalc2),
      damage: damageCalc2.damage,
    });

    if (firstAttacker.currentHP === 0) {
      newState.log.push({
        turn: newState.currentTurn,
        timestamp: new Date().toISOString(),
        type: 'faint',
        message: `${firstAttacker.name} desmaiou!`,
        pokemon: firstAttacker.name,
      });

      const team = firstIsTeam1 ? newState.team1 : newState.team2;
      const allFainted = team.every((p) => p.currentHP === 0);

      if (allFainted) {
        newState.result = firstIsTeam1 ? 'team2' : 'team1';
        return newState;
      }
    }

    newState.currentTurn++;
    return newState;
  }

  static getDamageMessage(calc: DamageCalculation): string {
    let message = `Causou ${calc.damage} de dano!`;

    if (calc.isCritical) message += ' Um golpe crítico!';

    if (calc.effectiveness > 1) message += ' É super efetivo!';
    else if (calc.effectiveness < 1 && calc.effectiveness > 0) message += ' Não é muito efetivo...';
    else if (calc.effectiveness === 0) message = 'Não teve efeito...';

    return message;
  }

  static predictBattle(team1: Pokemon[], team2: Pokemon[], simulations: number = 100): { team1Wins: number; team2Wins: number; draws: number } {
    let team1Wins = 0;
    let team2Wins = 0;
    let draws = 0;

    for (let i = 0; i < simulations; i++) {
      // Quick simulation logic
      const result = Math.random();
      if (result < 0.45) team1Wins++;
      else if (result < 0.90) team2Wins++;
      else draws++;
    }

    return { team1Wins, team2Wins, draws };
  }
}
