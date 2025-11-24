"use client";

import { motion } from 'framer-motion';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { useAppStore } from '@/store/app-store';
import { weatherPokemonMap, weatherTypeBoosts } from '@/lib/weather/weather-pokemon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Zap, Info } from 'lucide-react';

export default function WeatherEventsPage() {
  const { weatherData } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Cloud className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold">Weather Events</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Pokémon especiais baseados no clima real da sua região!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="lg:col-span-2">
          <WeatherWidget />
        </div>

        {/* Info Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg">Como Funciona?</h3>
          </div>

          <div className="space-y-3 text-sm">
            <p>
              O clima real da sua região influencia os Pokémon disponíveis e bônus de tipo!
            </p>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-bold mb-1">☀️ Dias ensolarados:</p>
              <p className="text-muted-foreground">Pokémon de Fire e Grass recebem +20% de poder</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-bold mb-1">🌧️ Dias chuvosos:</p>
              <p className="text-muted-foreground">Pokémon de Water e Electric recebem +20% de poder</p>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="font-bold mb-1">❄️ Dias nevados:</p>
              <p className="text-muted-foreground">Pokémon de Ice recebem +20% de poder</p>
            </div>

            <p className="text-muted-foreground">
              💡 O clima atualiza automaticamente a cada 30 minutos!
            </p>
          </div>
        </Card>
      </div>

      {/* Featured Pokemon by Weather */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Pokémon por Clima</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(weatherPokemonMap).map(([weather, pokemonList]) => {
            const boostedTypes = weatherTypeBoosts[weather as keyof typeof weatherTypeBoosts];

            return (
              <motion.div
                key={weather}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={`p-4 ${weatherData?.condition === weather ? 'border-2 border-yellow-400' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold">{weather}</h3>
                    {weatherData?.condition === weather && (
                      <Badge className="bg-yellow-500 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    )}
                  </div>

                  {boostedTypes && boostedTypes.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {boostedTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs capitalize">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {pokemonList.slice(0, 3).map((p, i) => (
                      <span key={i} className="capitalize">
                        {p}
                        {i < Math.min(2, pokemonList.length - 1) && ', '}
                      </span>
                    ))}
                    {pokemonList.length > 3 && ` +${pokemonList.length - 3} mais`}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
