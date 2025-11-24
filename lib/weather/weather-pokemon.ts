import { WeatherData, WeatherEvent, DailyPokemon } from '@/types/app';
import { PokemonType } from '@/types/pokemon';

export const weatherPokemonMap: Record<WeatherData['condition'], string[]> = {
  Clear: ['charizard', 'ninetales', 'arcanine', 'flareon', 'typhlosion', 'torchic', 'combusken', 'blaziken'],
  Rain: ['kyogre', 'blastoise', 'lapras', 'vaporeon', 'suicune', 'swampert', 'milotic', 'empoleon'],
  Snow: ['abomasnow', 'glaceon', 'articuno', 'lapras', 'walrein', 'froslass', 'mamoswine'],
  Clouds: ['altaria', 'pidgeot', 'dragonite', 'salamence', 'swablu', 'skarmory', 'togekiss'],
  Thunderstorm: ['zapdos', 'raikou', 'electabuzz', 'jolteon', 'ampharos', 'manectric', 'luxray', 'zebstrika'],
  Drizzle: ['politoed', 'pelipper', 'vaporeon', 'ludicolo', 'castform'],
  Mist: ['gengar', 'misdreavus', 'duskull', 'mismagius', 'spiritomb', 'giratina'],
  Fog: ['gastly', 'haunter', 'gengar', 'misdreavus', 'mismagius', 'drifblim'],
};

export const weatherTypeBoosts: Record<WeatherData['condition'], PokemonType[]> = {
  Clear: ['fire', 'grass'],
  Rain: ['water', 'electric'],
  Snow: ['ice'],
  Clouds: ['flying', 'dragon'],
  Thunderstorm: ['electric'],
  Drizzle: ['water'],
  Mist: ['ghost', 'psychic'],
  Fog: ['ghost', 'dark'],
};

export class WeatherPokemonService {
  static async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

      if (!apiKey) {
        // Fallback to random weather
        return this.getRandomWeather();
      }

      // Use provided coordinates or default location
      const latitude = lat || -23.55;
      const longitude = lon || -46.63;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        return this.getRandomWeather();
      }

      const data = await response.json();

      return {
        city: data.name,
        country: data.sys.country,
        condition: this.mapWeatherCondition(data.weather[0].main),
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        timestamp: new Date().toISOString(),
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return this.getRandomWeather();
    }
  }

  static mapWeatherCondition(condition: string): WeatherData['condition'] {
    const conditionMap: Record<string, WeatherData['condition']> = {
      Clear: 'Clear',
      Clouds: 'Clouds',
      Rain: 'Rain',
      Drizzle: 'Drizzle',
      Thunderstorm: 'Thunderstorm',
      Snow: 'Snow',
      Mist: 'Mist',
      Fog: 'Fog',
    };

    return conditionMap[condition] || 'Clear';
  }

  static getRandomWeather(): WeatherData {
    const conditions: WeatherData['condition'][] = [
      'Clear',
      'Rain',
      'Snow',
      'Clouds',
      'Thunderstorm',
    ];

    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      city: 'Demo City',
      country: 'XX',
      condition,
      temperature: Math.floor(Math.random() * 30) + 10,
      humidity: Math.floor(Math.random() * 50) + 40,
      description: condition.toLowerCase(),
      timestamp: new Date().toISOString(),
    };
  }

  static selectDailyPokemon(weather: WeatherData): string {
    const pokemonList = weatherPokemonMap[weather.condition];
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    return pokemonList[randomIndex];
  }

  static getWeatherBoostTypes(weather: WeatherData): PokemonType[] {
    return weatherTypeBoosts[weather.condition] || [];
  }

  static calculateWeatherBonus(weather: WeatherData): number {
    // Bonus multiplier based on weather
    return 1.2; // 20% bonus
  }

  static createWeatherEvent(weather: WeatherData): WeatherEvent {
    const boostedTypes = this.getWeatherBoostTypes(weather);
    const featuredPokemon = weatherPokemonMap[weather.condition] || [];
    const duration = 60; // 1 hour
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    return {
      id: Date.now().toString(),
      name: `${weather.condition} Special`,
      description: `Durante ${weather.condition}, Pokémon de tipos ${boostedTypes.join(', ')} recebem bônus!`,
      weather: [weather.condition],
      boostedTypes,
      boostMultiplier: 1.2,
      featuredPokemon: featuredPokemon.slice(0, 5),
      duration,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      active: true,
    };
  }

  static isEventActive(event: WeatherEvent): boolean {
    const now = new Date();
    const endTime = new Date(event.endTime);
    return now < endTime;
  }

  static getWeatherEmoji(condition: WeatherData['condition']): string {
    const emojiMap: Record<WeatherData['condition'], string> = {
      Clear: '☀️',
      Rain: '🌧️',
      Snow: '❄️',
      Clouds: '☁️',
      Thunderstorm: '⛈️',
      Drizzle: '🌦️',
      Mist: '🌫️',
      Fog: '🌫️',
    };

    return emojiMap[condition] || '🌤️';
  }

  static getTimeUntilNextChange(lastUpdate: string): number {
    const lastUpdateTime = new Date(lastUpdate);
    const nextUpdate = new Date(lastUpdateTime.getTime() + 30 * 60 * 1000); // 30 minutes
    const now = new Date();
    const diff = nextUpdate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000 / 60)); // minutes
  }
}
