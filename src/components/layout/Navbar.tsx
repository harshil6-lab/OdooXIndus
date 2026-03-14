import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { useTheme } from '@/contexts/ThemeContext'
import { useAppStore } from '@/stores/appStore'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { setCommandPaletteOpen, setSearchOpen } = useAppStore()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notifications = [
    { id: '1', title: 'Low Stock Alert', message: 'USB-C Cable stock is below reorder level', time: '5m ago', type: 'alert' },
    { id: '2', title: 'Receipt Received', message: 'Laptop shipment from TechCorp received', time: '2h ago', type: 'success' },
    { id: '3', title: 'Delivery Shipped', message: 'Order ORD-001 has been shipped', time: '1d ago', type: 'info' },
  ]

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4">
        {/* Left Section - Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative hidden w-full max-w-xl items-center sm:flex">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors" />
            <Input
              placeholder="Search products, warehouses, transfers..."
              className="h-10 rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-14 text-sm text-slate-100 placeholder:text-slate-400 transition-all focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
              onFocus={() => setSearchOpen(true)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Command Palette / Search Mobile */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCommandPaletteOpen(true)}
              className="sm:hidden hover:bg-slate-800 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Notifications */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-slate-800 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <motion.span
                    className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 border-slate-700 bg-slate-900/95 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                <div className="text-sm font-semibold">Notifications</div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 hover:bg-slate-800"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    ×
                  </Button>
                </motion.div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif, idx) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="group cursor-pointer border-b border-slate-800 px-4 py-3 last:border-b-0 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.type === 'alert' ? 'bg-destructive' :
                        notif.type === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">{notif.title}</div>
                        <div className="text-xs text-muted-foreground">{notif.message}</div>
                        <div className="text-xs text-muted-foreground/60 mt-1">{notif.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenuItem className="cursor-pointer justify-center text-xs hover:bg-slate-800">
                  View all notifications
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </motion.div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="hover:bg-slate-800 transition-colors">
                  <motion.div
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 border border-white/20"
                    whileHover={{ scale: 1.1 }}
                  />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-slate-700 bg-slate-900/95 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-slate-700 px-4 py-3"
              >
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Admin User</div>
              </motion.div>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-slate-800">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 hover:bg-slate-800">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
