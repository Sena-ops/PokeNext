'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTeamStore } from '@/store/team-store'
import { PokemonSearch } from '@/components/pokemon/pokemon-search'
import { TeamSlot } from '@/components/pokemon/team-slot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Download, Upload, Trash2, Plus } from 'lucide-react'
import { Pokemon } from '@/types/pokemon'

export function TeamBuilder() {
  const { currentTeam, addPokemon, removePokemon, clearTeam, saveTeam, exportTeam, importTeam } = useTeamStore()
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [teamName, setTeamName] = useState('')

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (selectedSlot !== null) {
      addPokemon({ ...pokemon, position: selectedSlot }, selectedSlot)
      setSelectedSlot(null)
    } else {
      const emptySlot = currentTeam.findIndex((p) => p === null)
      if (emptySlot !== -1) {
        addPokemon({ ...pokemon, position: emptySlot }, emptySlot)
      }
    }
  }

  const handleSaveTeam = () => {
    if (!teamName) {
      alert('Por favor, dê um nome ao seu time!')
      return
    }
    if (currentTeam.filter(p => p !== null).length === 0) {
      alert('Adicione pelo menos um Pokémon ao time!')
      return
    }
    saveTeam(teamName)
    setTeamName('')
  }

  const handleExportTeam = () => {
    const data = exportTeam()
    navigator.clipboard.writeText(data)
    alert('Time copiado para a área de transferência!')
  }

  const handleImportTeam = () => {
    navigator.clipboard.readText().then((data) => {
      importTeam(data)
      alert('Time importado com sucesso!')
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Pokémon</CardTitle>
          <CardDescription>
            {selectedSlot !== null
              ? `Selecionando para a posição ${selectedSlot + 1}`
              : 'Clique em um slot ou adicione automaticamente'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PokemonSearch onSelect={handleSelectPokemon} />
        </CardContent>
      </Card>

      {/* Team Slots */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seu Time</CardTitle>
              <CardDescription>
                {currentTeam.filter(p => p !== null).length}/6 Pokémon
              </CardDescription>
            </div>
            {currentTeam.some(p => p !== null) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearTeam}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Time
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((position) => (
              <motion.div
                key={position}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TeamSlot
                  pokemon={currentTeam[position]}
                  position={position}
                  onRemove={() => removePokemon(position)}
                  onClick={() => setSelectedSlot(position)}
                  isSelected={selectedSlot === position}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ações do Time</CardTitle>
          <CardDescription>Salve, exporte ou importe seu time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do time..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTeam()}
            />
            <Button onClick={handleSaveTeam}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleExportTeam}
              disabled={currentTeam.filter(p => p !== null).length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleImportTeam}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
