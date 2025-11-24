'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, Plus, Trophy, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Users, label: 'Time', href: '/team' },
  { icon: Plus, label: 'Novo', href: '/team-builder', accent: true },
  { icon: Trophy, label: 'Ranks', href: '/achievements' },
  { icon: UserCircle, label: 'Perfil', href: '/settings' }
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border/40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link key={index} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center gap-1">
                {item.accent ? (
                  <div className="relative -top-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Icon className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? "text-red-500" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "text-xs transition-colors",
                      isActive ? "text-red-500 font-medium" : "text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
