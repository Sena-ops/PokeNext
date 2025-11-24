'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, BarChart3, Sparkles, Save } from 'lucide-react'
import { TeamBuilder } from '@/components/team/TeamBuilder'
import { TeamAnalysisView } from '@/components/team/TeamAnalysisView'
import { TeamSuggestionsView } from '@/components/team/TeamSuggestionsView'
import { SavedTeamsView } from '@/components/team/SavedTeamsView'

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('builder')

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Time</h1>
        <p className="text-muted-foreground">
          Construa, analise e otimize seu time perfeito
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="builder" className="flex items-center gap-2 py-3">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Construtor</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Análise</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2 py-3">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Sugestões IA</span>
            <span className="sm:hidden">IA</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2 py-3">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Times Salvos</span>
            <span className="sm:hidden">Salvos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <TeamBuilder />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <TeamAnalysisView />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <TeamSuggestionsView />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedTeamsView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
