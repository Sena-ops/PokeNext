'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

interface MenuItem {
  icon: any
  label: string
  href: string
  badge?: string
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const menuStructure: MenuGroup[] = [
  {
    title: 'Principal',
    items: [
      { icon: Home, label: 'Dashboard', href: '/' },
      { icon: Users, label: 'Meu Time', href: '/team' }
    ]
  },
  {
    title: 'Recursos',
    items: [
      { icon: Sparkles, label: 'AI Coach', href: '/ai-coach' },
      { icon: Swords, label: 'Simulador', href: '/battle-sim' },
      { icon: Globe, label: 'Social Hub', href: '/social-hub' },
      { icon: Trophy, label: 'Conquistas', href: '/achievements' },
      { icon: Cloud, label: 'Eventos', href: '/weather-events' }
    ]
  },
  {
    title: 'Ferramentas',
    items: [
      { icon: Book, label: 'Pokédex', href: '/flavor' },
      { icon: Calculator, label: 'Calculadoras', href: '/tools' },
      { icon: FileText, label: 'Guias', href: '/explorer/encounters' }
    ]
  }
]

interface MainLayoutProps {
  children: ReactNode
  onCommandOpen?: () => void
}

export function MainLayout({ children, onCommandOpen }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  // Breadcrumbs dinâmicos
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    if (paths.length === 0) return ['Dashboard']

    const breadcrumbs = paths.map(path => {
      return path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    })

    return breadcrumbs
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">
                PokéTeam Trainer
              </span>
            </Link>
          </div>

          {/* Center: Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <span className={cn(
                  index === getBreadcrumbs().length - 1 && "text-foreground font-medium"
                )}>
                  {crumb}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search/Command Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 min-w-[200px] justify-start text-muted-foreground"
              onClick={onCommandOpen}
            >
              <Search className="h-4 w-4" />
              <span>Buscar...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onCommandOpen}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <UserCircle className="h-5 w-5" />
              </Button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-background shadow-lg z-50">
                    <div className="p-3 border-b border-border">
                      <p className="font-medium">Treinador</p>
                      <p className="text-sm text-muted-foreground">Nível 42</p>
                    </div>
                    <div className="p-1">
                      <Link href="/settings">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent">
                          <SettingsIcon className="h-4 w-4" />
                          Configurações
                        </button>
                      </Link>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent text-red-500">
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <aside className={cn(
          "hidden lg:block fixed left-0 top-16 bottom-0 border-r border-border/40 bg-background transition-all duration-300 z-40",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <div className="flex flex-col h-full">
            {/* Menu Groups */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-6">
              {menuStructure.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {sidebarOpen && (
                    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item, itemIndex) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))

                      return (
                        <Link key={itemIndex} href={item.href}>
                          <div className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                            isActive
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                              : "hover:bg-accent text-foreground",
                            !sidebarOpen && "justify-center"
                          )}>
                            <Icon className={cn("h-5 w-5", sidebarOpen ? "" : "h-6 w-6")} />
                            {sidebarOpen && (
                              <span className="font-medium">{item.label}</span>
                            )}
                            {sidebarOpen && item.badge && (
                              <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Collapse Button */}
            <div className="p-3 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? (
                  <>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    <span>Recolher</span>
                  </>
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            <aside className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r border-border shadow-lg z-50 lg:hidden">
              <nav className="p-3 space-y-6 overflow-y-auto h-full">
                {menuStructure.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item, itemIndex) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href ||
                          (item.href !== '/' && pathname.startsWith(item.href))

                        return (
                          <Link key={itemIndex} href={item.href} onClick={toggleMobileMenu}>
                            <div className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                              isActive
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                                : "hover:bg-accent"
                            )}>
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                              {item.badge && (
                                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-16"
        )}>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
