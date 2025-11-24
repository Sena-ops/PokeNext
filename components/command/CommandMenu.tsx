'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  Users,
  Sparkles,
  Swords,
  Trophy,
  Cloud,
  Book,
  Calculator,
  FileText,
  Plus,
  Search,
  Clock,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  icon: any
  href?: string
  action?: () => void
  category: 'navigation' | 'actions' | 'recent'
  keywords?: string[]
}

const navigationItems: CommandItem[] = [
  { id: 'home', label: 'Dashboard', icon: Home, href: '/', category: 'navigation', keywords: ['inicio', 'home', 'dashboard'] },
  { id: 'team', label: 'Meu Time', icon: Users, href: '/team', category: 'navigation', keywords: ['time', 'equipe', 'pokemon'] },
  { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, href: '/ai-coach', category: 'navigation', keywords: ['ia', 'coach', 'ajuda', 'professor'] },
  { id: 'battle', label: 'Simulador de Batalha', icon: Swords, href: '/battle-sim', category: 'navigation', keywords: ['batalha', 'luta', 'simulador'] },
  { id: 'social', label: 'Social Hub', icon: Globe, href: '/social-hub', category: 'navigation', keywords: ['social', 'compartilhar', 'comunidade'] },
  { id: 'achievements', label: 'Conquistas', icon: Trophy, href: '/achievements', category: 'navigation', keywords: ['conquistas', 'trofeus', 'achievements'] },
  { id: 'weather', label: 'Eventos Climáticos', icon: Cloud, href: '/weather-events', category: 'navigation', keywords: ['clima', 'tempo', 'eventos'] },
  { id: 'pokedex', label: 'Pokédex', icon: Book, href: '/flavor', category: 'navigation', keywords: ['pokedex', 'pokemon', 'lista'] },
  { id: 'tools', label: 'Calculadoras', icon: Calculator, href: '/tools', category: 'navigation', keywords: ['ferramentas', 'calculadora', 'tools'] },
  { id: 'guides', label: 'Guias', icon: FileText, href: '/explorer/encounters', category: 'navigation', keywords: ['guias', 'ajuda', 'tutoriais'] }
]

const actionItems: CommandItem[] = [
  { id: 'new-team', label: 'Novo Time', icon: Plus, href: '/team-builder', category: 'actions', keywords: ['criar', 'novo', 'time'] },
  { id: 'add-pokemon', label: 'Adicionar Pokémon', icon: Plus, href: '/team', category: 'actions', keywords: ['adicionar', 'pokemon'] },
  { id: 'new-battle', label: 'Nova Batalha', icon: Swords, href: '/battle-sim', category: 'actions', keywords: ['batalha', 'nova', 'simulacao'] }
]

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentItems, setRecentItems] = useState<CommandItem[]>([])
  const router = useRouter()

  // Load recent items from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('command-recent')
    if (recent) {
      const items = JSON.parse(recent) as CommandItem[]
      setRecentItems(items.slice(0, 5))
    }
  }, [open])

  // Filter items based on search
  const filteredItems = [...navigationItems, ...actionItems].filter(item => {
    if (!search) return false
    const searchLower = search.toLowerCase()
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.keywords?.some(keyword => keyword.includes(searchLower))
    )
  })

  const displayItems = search ? filteredItems : recentItems

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) {
        // Open with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault()
          onOpenChange(true)
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          onOpenChange(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % displayItems.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + displayItems.length) % displayItems.length)
          break
        case 'Enter':
          e.preventDefault()
          if (displayItems[selectedIndex]) {
            selectItem(displayItems[selectedIndex])
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, displayItems, selectedIndex])

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [open])

  const selectItem = useCallback((item: CommandItem) => {
    // Save to recent
    const recent = [item, ...recentItems.filter(i => i.id !== item.id)].slice(0, 5)
    localStorage.setItem('command-recent', JSON.stringify(recent))
    setRecentItems(recent)

    // Execute action
    if (item.action) {
      item.action()
    } else if (item.href) {
      router.push(item.href)
    }

    onOpenChange(false)
  }, [recentItems, router, onOpenChange])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />

      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="mx-4 bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar páginas, ações..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelectedIndex(0)
              }}
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {displayItems.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {search ? (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhum resultado encontrado</p>
                    <p className="text-sm mt-1">Tente buscar por outra coisa</p>
                  </>
                ) : (
                  <>
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhum item recente</p>
                    <p className="text-sm mt-1">Comece a buscar para ver resultados</p>
                  </>
                )}
              </div>
            ) : (
              <>
                {!search && recentItems.length > 0 && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recentes
                  </div>
                )}

                {displayItems.map((item, index) => {
                  const Icon = item.icon
                  const isSelected = index === selectedIndex

                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                        isSelected
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => selectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isSelected
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.label}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.category === 'navigation' ? 'Navegar para' : 'Ação'}
                        </p>
                      </div>
                      {isSelected && (
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                          ↵
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                  ↑↓
                </kbd>
                Navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                  ↵
                </kbd>
                Selecionar
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                ESC
              </kbd>
              Fechar
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook for easy integration
export function useCommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { open, setOpen }
}
