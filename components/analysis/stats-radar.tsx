"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface StatsRadarProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

export function StatsRadar({ stats }: StatsRadarProps) {
  const data = [
    { stat: 'HP', value: stats.hp },
    { stat: 'Ataque', value: stats.attack },
    { stat: 'Defesa', value: stats.defense },
    { stat: 'Atq. Esp.', value: stats.specialAttack },
    { stat: 'Def. Esp.', value: stats.specialDefense },
    { stat: 'Velocidade', value: stats.speed },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#666" />
          <PolarAngleAxis
            dataKey="stat"
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fill: 'currentColor' }} />
          <Radar
            name="Stats"
            dataKey="value"
            stroke="#EE1515"
            fill="#EE1515"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

