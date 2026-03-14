import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useAppStore } from '@/stores/appStore'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen, userPreferences } = useAppStore()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <motion.main
        animate={{
          marginLeft: sidebarOpen ? 256 : 80,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        }}
        className="hidden lg:block pt-16 min-h-screen"
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>

      {/* Mobile Content */}
      <main className="block lg:hidden pt-16 pb-20">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
