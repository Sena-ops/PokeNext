'use client'

import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

const weatherIcons = {
  clear: Sun,
  rain: CloudRain,
  snow: CloudSnow,
  cloudy: Cloud,
  wind: Wind,
  storm: Zap
}

export function WeatherWidget({ className }: { className?: string }) {
  const { weatherData } = useAppStore()

  const WeatherIcon = weatherIcons[weatherData?.condition as keyof typeof weatherIcons] || Cloud

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg">Clima Atual</CardTitle>
          <CardDescription>
            {weatherData?.city || 'Carregando...'}
          </CardDescription>
        </div>
        <Link href="/weather-events">
          <Button variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <WeatherIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold">
              {weatherData?.temperature || '--'}°C
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {weatherData?.condition || 'Desconhecido'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {weatherData?.description || 'Bom tempo para treinar!'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
