import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Command as CommandIcon, Package, Truck, FileText, Settings, HelpCircle, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAppStore } from '@/stores/appStore'
import { Input } from '@/components/ui/Input'

interface Command {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
  category: string
}

export default function CommandPalette() {
  const navigate = useNavigate()
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Go to dashboard',
      icon: <CommandIcon className="h-4 w-4" />,
      action: () => {
        navigate('/')
        setCommandPaletteOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'products',
      label: 'Products',
      description: 'View all products',
      icon: <Package className="h-4 w-4" />,
      action: () => {
        navigate('/products')
        setCommandPaletteOpen(false)
      },
      category: 'Navigation',
    },
    {
      id: 'receipts',
      label: 'Receipts',
      description: 'Incoming goods receipts',
      icon: <FileText className="h-4 w-4" />,
      action: () => {
        navigate('/receipts')
        setCommandPaletteOpen(false)
      },
      category: 'Operations',
    },
    {
      id: 'delivery',
      label: 'Delivery Orders',
      description: 'Outgoing delivery orders',
      icon: <Truck className="h-4 w-4" />,
      action: () => {
        navigate('/delivery')
        setCommandPaletteOpen(false)
      },
      category: 'Operations',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Application settings',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        navigate('/settings')
        setCommandPaletteOpen(false)
      },
      category: 'Preferences',
    },
    {
      id: 'help',
      label: 'Help & Support',
      description: 'Get help with CoreInventory',
      icon: <HelpCircle className="h-4 w-4" />,
      action: () => {
        setCommandPaletteOpen(false)
      },
      category: 'Help',
    },
  ]

  const filteredCommands = useMemo(() => {
    if (!search) return commands
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const allFilteredCommands = Object.values(groupedCommands).flat()

  const handleSelectCommand = () => {
    if (allFilteredCommands[selectedIndex]) {
      allFilteredCommands[selectedIndex].action()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % allFilteredCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + allFilteredCommands.length) % allFilteredCommands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelectCommand()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, selectedIndex, allFilteredCommands])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border border-border bg-background shadow-soft-xl"
          >
            {/* Header */}
            <div className="flex items-center border-b border-border px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search commands..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(false)}
                className="ml-2 text-muted-foreground hover:text-foreground"
                aria-label="Close command palette"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {allFilteredCommands.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No commands found</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </div>
                    {cmds.map((cmd) => {
                      const globalIdx = allFilteredCommands.indexOf(cmd)
                      const isSelected = globalIdx === selectedIndex
                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={() => {
                            setSelectedIndex(globalIdx)
                            cmd.action()
                          }}
                          whileHover={{ backgroundColor: 'var(--accent)' }}
                          className={cn(
                            'w-full px-4 py-3 flex items-center gap-3 text-left transition-colors',
                            isSelected && 'bg-accent'
                          )}
                        >
                          <div className="text-muted-foreground">{cmd.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{cmd.label}</div>
                            <div className="text-xs text-muted-foreground">{cmd.description}</div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex gap-2">
                <kbd className="rounded-sm bg-muted px-2 py-1">↓</kbd>
                <kbd className="rounded-sm bg-muted px-2 py-1">↑</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex gap-2">
                <kbd className="rounded-sm bg-muted px-2 py-1">Enter</kbd>
                <span>Select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
