"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTeamStore } from '@/store/team-store';
import { PokemonSearch } from '@/components/pokemon/pokemon-search';
import { TeamSlot } from '@/components/pokemon/team-slot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save, Download, Upload, Trash2, ArrowLeft } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import Link from 'next/link';
import { Toast } from '@/components/ui/toast';

export default function TeamBuilderPage() {
  const { currentTeam, addPokemon, removePokemon, clearTeam, saveTeam, exportTeam, importTeam } = useTeamStore();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [teamName, setTeamName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (selectedSlot !== null) {
      addPokemon({ ...pokemon, position: selectedSlot }, selectedSlot);
      setSelectedSlot(null);
      showToastMessage(`${pokemon.name} adicionado ao time!`);
    } else {
      // Find first empty slot
      const emptySlot = currentTeam.findIndex((p) => p === null);
      if (emptySlot !== -1) {
        addPokemon({ ...pokemon, position: emptySlot }, emptySlot);
        showToastMessage(`${pokemon.name} adicionado ao time!`);
      } else {
        showToastMessage('Time completo! Remova um Pokémon primeiro.');
      }
    }
  };

  const handleSaveTeam = () => {
    if (!teamName) {
      showToastMessage('Por favor, dê um nome ao seu time!');
      return;
    }
    if (currentTeam.filter(p => p !== null).length === 0) {
      showToastMessage('Adicione pelo menos um Pokémon ao time!');
      return;
    }
    saveTeam(teamName);
    showToastMessage(`Time "${teamName}" salvo com sucesso!`);
    setTeamName('');
  };

  const handleExportTeam = () => {
    const data = exportTeam();
    navigator.clipboard.writeText(data);
    showToastMessage('Time copiado para a área de transferência!');
  };

  const handleImportTeam = () => {
    navigator.clipboard.readText().then((data) => {
      importTeam(data);
      showToastMessage('Time importado com sucesso!');
    });
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pokemon-red/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Team Builder
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Monte seu time perfeito e analise a sinergia entre seus Pokémon
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Buscar Pokémon</h2>
          <PokemonSearch onSelect={handleSelectPokemon} />
          {selectedSlot !== null && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selecionando para o Slot {selectedSlot + 1}
            </p>
          )}
        </Card>

        {/* Team Grid */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Seu Time</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportTeam}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={handleImportTeam}>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
              <Button variant="destructive" size="sm" onClick={clearTeam}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {currentTeam.map((pokemon, index) => (
              <div
                key={index}
                onClick={() => !pokemon && setSelectedSlot(index)}
                className="cursor-pointer"
              >
                <TeamSlot
                  pokemon={pokemon}
                  position={index}
                  onRemove={() => removePokemon(index)}
                  className={selectedSlot === index ? 'ring-2 ring-pokemon-red' : ''}
                />
              </div>
            ))}
          </div>

          {/* Save Team */}
          <div className="flex gap-4">
            <Input
              placeholder="Nome do time..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveTeam}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Time
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/team-analysis">
              <Button size="lg" className="bg-pokemon-yellow text-pokemon-black hover:bg-yellow-400">
                Analisar Time
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast onClose={() => setShowToast(false)}>
            {toastMessage}
          </Toast>
        </div>
      )}
    </div>
  );
}

