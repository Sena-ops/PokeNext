'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocationArea } from '@/lib/api/pokemon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { simulateEncounters, formatEncounterMethod } from '@/lib/utils/encounter-simulator';
import { Play, TrendingUp, Hash, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface EncounterSimulatorProps {
  locationAreaName: string;
}

export function EncounterSimulator({ locationAreaName }: EncounterSimulatorProps) {
  const [trials, setTrials] = useState(1000);
  const [version, setVersion] = useState('red');
  const [method, setMethod] = useState('walk');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const { data: locationArea, isLoading } = useQuery({
    queryKey: ['location-area', locationAreaName],
    queryFn: () => getLocationArea(locationAreaName),
    staleTime: 1000 * 60 * 60
  });
  
  const runSimulation = () => {
    if (!locationArea) return;
    
    setIsSimulating(true);
    setTimeout(() => {
      const encounters = locationArea.pokemon_encounters.map(pe => ({
        location_area: { name: pe.pokemon.name, url: pe.pokemon.url },
        version_details: pe.version_details.map(vd => ({
          version: vd.version,
          max_chance: vd.max_chance,
          encounter_details: vd.encounter_details
        }))
      }));
      
      const result = simulateEncounters(encounters as any, {
        trials,
        version,
        method,
        shinyRate: 1 / 4096
      });
      
      setSimulationResult(result);
      setIsSimulating(false);
    }, 500);
  };
  
  if (isLoading) {
    return <div>Loading location data...</div>;
  }
  
  if (!locationArea) {
    return <div>Location not found</div>;
  }
  
  // Get available versions and methods
  const availableVersions = Array.from(
    new Set(
      locationArea.pokemon_encounters.flatMap(pe =>
        pe.version_details.map(vd => vd.version.name)
      )
    )
  );
  
  const availableMethods = Array.from(
    new Set(
      locationArea.pokemon_encounters.flatMap(pe =>
        pe.version_details.flatMap(vd =>
          vd.encounter_details.map(ed => ed.method.name)
        )
      )
    )
  );
  
  const chartData = simulationResult?.results.map((r: any) => ({
    name: r.pokemonName.replace(/-/g, ' '),
    encounters: r.encounters,
    probability: r.probability * 100
  })) || [];
  
  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Simulation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trials */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Number of Trials
            </label>
            <Input
              type="number"
              value={trials}
              onChange={(e) => setTrials(parseInt(e.target.value) || 1000)}
              min={100}
              max={10000}
              step={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher trials = more accurate results (100-10,000)
            </p>
          </div>
          
          {/* Version */}
          <div>
            <label className="text-sm font-medium mb-2 block">Version</label>
            <div className="flex flex-wrap gap-2">
              {availableVersions.slice(0, 8).map(v => (
                <Badge
                  key={v}
                  variant={version === v ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => setVersion(v)}
                >
                  {v.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Method */}
          <div>
            <label className="text-sm font-medium mb-2 block">Encounter Method</label>
            <div className="flex flex-wrap gap-2">
              {availableMethods.map(m => (
                <Badge
                  key={m}
                  variant={method === m ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => setMethod(m)}
                >
                  {formatEncounterMethod(m)}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full"
          >
            <Play className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-pulse' : ''}`} />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </Button>
        </CardContent>
      </Card>
      
      {/* Results */}
      <AnimatePresence>
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Hash className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{simulationResult.totalTrials}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Trials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {simulationResult.averageLevel.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        1/{Math.round(1 / simulationResult.shinyRate)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Shiny Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Encounter Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="encounters" fill="#3b82f6">
                      {chartData.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${200 + index * 30}, 70%, 50%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {simulationResult.results.map((result: any, index: number) => (
                    <motion.div
                      key={result.pokemonName}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold capitalize">
                          {result.pokemonName.replace(/-/g, ' ')}
                        </h3>
                        <Badge variant="secondary">
                          {(result.probability * 100).toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Encounters</p>
                          <p className="font-semibold">{result.encounters}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Level Range</p>
                          <p className="font-semibold">
                            {result.levelRange.min}-{result.levelRange.max}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Shiny</p>
                          <p className="font-semibold">
                            {result.shinyEncounters}
                            {result.shinyEncounters > 0 && ' ✨'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

