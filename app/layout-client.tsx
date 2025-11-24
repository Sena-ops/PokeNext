'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { CommandMenu } from '@/components/command/CommandMenu'
import { Toaster } from '@/components/ui/sonner'

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <>
      <MainLayout onCommandOpen={() => setCommandOpen(true)}>
        {children}
      </MainLayout>
      <MobileBottomNav />
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      <Toaster />
    </>
  )
}
