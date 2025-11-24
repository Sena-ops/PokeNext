"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { WeatherPokemonService } from '@/lib/weather/weather-pokemon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, MapPin, Thermometer, Droplets, RefreshCw, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function WeatherWidget() {
  const { weatherData, updateWeather } = useAppStore();
  const [dailyPokemon, setDailyPokemon] = useState<string | null>(null);

  // Fetch weather
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['weather'],
    queryFn: () => WeatherPokemonService.getCurrentWeather(),
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      updateWeather(data);

      // Select daily Pokemon
      const pokemon = WeatherPokemonService.selectDailyPokemon(data);
      setDailyPokemon(pokemon);
    }
  }, [data, updateWeather]);

  const weather = weatherData || data;

  if (!weather) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin">
            <Cloud className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
      </Card>
    );
  }

  const weatherEmoji = WeatherPokemonService.getWeatherEmoji(weather.condition);
  const boostedTypes = WeatherPokemonService.getWeatherBoostTypes(weather);
  const timeUntilNext = WeatherPokemonService.getTimeUntilNextChange(weather.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 overflow-hidden">
        {/* Background animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute -right-10 -top-10 text-9xl opacity-30"
        >
          {weatherEmoji}
        </motion.div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl">{weatherEmoji}</div>
              <div>
                <h3 className="text-2xl font-bold">{weather.condition}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{weather.city}, {weather.country}</span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Weather Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
              <Thermometer className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Temperatura</p>
                <p className="font-bold">{weather.temperature}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Umidade</p>
                <p className="font-bold">{weather.humidity}%</p>
              </div>
            </div>
          </div>

          {/* Boosted Types */}
          {boostedTypes.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-bold">Tipos Boosted (+20%)</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {boostedTypes.map((type) => (
                  <Badge key={type} className="bg-yellow-500 text-white capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Daily Pokemon */}
          {dailyPokemon && (
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <span>⭐</span>
                Pokémon do Dia:
              </p>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="font-bold capitalize">{dailyPokemon}</p>
              </div>
            </div>
          )}

          {/* Next Update */}
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Próxima atualização em {timeUntilNext} minutos
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
