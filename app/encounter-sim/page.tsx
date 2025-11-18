'use client';

import { useState } from 'react';
import { EncounterSimulator } from '@/components/simulator/encounter-simulator';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Zap, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EncounterSimPage() {
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      setSelectedLocation(locationInput.trim().toLowerCase().replace(/\s+/g, '-'));
    }
  };
  
  // Example locations
  const exampleLocations = [
    { name: 'Viridian Forest', id: 'viridian-forest-area' },
    { name: 'Route 1', id: 'kanto-route-1-area' },
    { name: 'Mt. Moon', id: 'mt-moon-1f' },
    { name: 'Safari Zone', id: 'kanto-safari-zone-center' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          <h1 className="text-4xl font-bold">Encounter Simulator</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Simulate wild Pokémon encounters and view statistical distributions.
        </p>
      </motion.div>
      
      {/* Location Input */}
      {!selectedLocation ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter Location Area Name
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="e.g., viridian-forest-area"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit">
                      Simulate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use lowercase with hyphens (e.g., viridian-forest-area)
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Examples */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Quick Examples</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {exampleLocations.map(location => (
                  <Button
                    key={location.id}
                    variant="outline"
                    onClick={() => setSelectedLocation(location.id)}
                    className="justify-start"
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Info */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">How it works</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Simulates N wild encounters in a location</li>
                <li>• Uses actual encounter rates from PokeAPI</li>
                <li>• Shows probability distribution and level ranges</li>
                <li>• Calculates shiny encounter chances (default: 1/4096)</li>
              </ul>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-3">
                <strong>Note:</strong> Shiny rates are configurable defaults as PokeAPI doesn't provide them.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Button
            variant="outline"
            onClick={() => setSelectedLocation(null)}
            className="mb-6"
          >
            ← Change Location
          </Button>
          
          <EncounterSimulator locationAreaName={selectedLocation} />
        </div>
      )}
    </div>
  );
}

