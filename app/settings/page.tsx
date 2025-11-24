'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppStore } from '@/store/app-store'
import { useTeamStore } from '@/store/team-store'
import { User, Bell, Database, Keyboard, Info, Download, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const { userProfile, updateUserProfile } = useAppStore()
  const { savedTeams, currentTeam, clearTeam } = useTeamStore()
  const [name, setName] = useState(userProfile?.name || 'Treinador')

  const handleSaveName = () => {
    updateUserProfile({ name })
    alert('Nome atualizado com sucesso!')
  }

  const handleExportData = () => {
    const data = {
      userProfile,
      savedTeams,
      currentTeam,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poketeam-backup-${Date.now()}.json`
    a.click()
  }

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e dados
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 py-3">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Preferências</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2 py-3">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Dados</span>
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="flex items-center gap-2 py-3">
            <Keyboard className="h-4 w-4" />
            <span className="hidden sm:inline">Atalhos</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2 py-3">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Sobre</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome de Treinador</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome..."
                  />
                  <Button onClick={handleSaveName}>Salvar</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Nível Atual</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {userProfile?.level || 1}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">XP Total</span>
                  <span className="text-sm text-muted-foreground">
                    {userProfile?.xp || 0} XP
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize a interface do aplicativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tema</p>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre modo claro e escuro
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure suas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Conquistas</p>
                  <p className="text-sm text-muted-foreground">
                    Notificar ao desbloquear conquistas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Eventos Climáticos</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas sobre eventos especiais
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Dados</CardTitle>
              <CardDescription>Exporte ou limpe seus dados salvos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Times Salvos</p>
                    <p className="text-sm text-muted-foreground">
                      {savedTeams.length} {savedTeams.length === 1 ? 'time' : 'times'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Time Atual</p>
                    <p className="text-sm text-muted-foreground">
                      {currentTeam.filter(p => p !== null).length} Pokémon
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Todos os Dados
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClearData}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shortcuts Tab */}
        <TabsContent value="shortcuts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Atalhos de Teclado</CardTitle>
              <CardDescription>Use estes atalhos para navegar mais rápido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { keys: ['⌘', 'K'], description: 'Abrir busca rápida' },
                  { keys: ['⌘', 'B'], description: 'Toggle sidebar' },
                  { keys: ['⌘', 'N'], description: 'Novo time' },
                  { keys: ['⌘', 'S'], description: 'Salvar time' },
                  { keys: ['ESC'], description: 'Fechar modais' }
                ].map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o PokéTeam Trainer</CardTitle>
              <CardDescription>Informações sobre o aplicativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">
                  <strong>Versão:</strong> 1.0.0
                </p>
                <p className="text-sm mb-2">
                  <strong>Desenvolvido por:</strong> PokéTeam Dev Team
                </p>
                <p className="text-sm text-muted-foreground">
                  Uma ferramenta completa para construir e analisar times Pokémon competitivos.
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Recursos</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• AI Strategy Coach</li>
                  <li>• Battle Simulator</li>
                  <li>• Team Analysis</li>
                  <li>• Social Hub</li>
                  <li>• Achievement System</li>
                  <li>• Weather Events</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
