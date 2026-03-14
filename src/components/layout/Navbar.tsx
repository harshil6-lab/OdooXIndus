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
  Command,
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
import { cn } from '@/utils/cn'
import { useTheme } from '@/contexts/ThemeContext'
import { useAppStore } from '@/stores/appStore'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { setCommandPaletteOpen, setSearchOpen, searchOpen } = useAppStore()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notifications = [
    { id: '1', title: 'Low Stock Alert', message: 'USB-C Cable stock is below reorder level', time: '5m ago', type: 'alert' },
    { id: '2', title: 'Receipt Received', message: 'Laptop shipment from TechCorp received', time: '2h ago', type: 'success' },
    { id: '3', title: 'Delivery Shipped', message: 'Order ORD-001 has been shipped', time: '1d ago', type: 'info' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative hidden sm:flex group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary/60 transition-colors" />
            <Input
              placeholder="Search products, orders..."
              className="pl-10 pr-10 bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20 placeholder:text-muted-foreground/60 transition-all focus:bg-white/10 focus:border-primary/50"
              onFocus={() => setSearchOpen(true)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-muted-foreground group-hover:bg-white/15 transition-colors">
              <Command className="h-3 w-3" />K
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
              className="sm:hidden hover:bg-white/10 transition-colors"
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
                  className="relative hover:bg-white/10 transition-colors"
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
            <DropdownMenuContent align="end" className="w-80 bg-background/95 backdrop-blur-xl border-white/10">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="text-sm font-semibold">Notifications</div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 hover:bg-white/10"
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
                    className="cursor-pointer border-b border-white/5 px-4 py-3 last:border-b-0 transition-colors group"
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
              <DropdownMenuSeparator className="bg-white/10" />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenuItem className="justify-center text-xs hover:bg-white/10 cursor-pointer">
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
              className="hover:bg-white/10 transition-colors"
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
                <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors">
                  <motion.div
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 border border-white/20"
                    whileHover={{ scale: 1.1 }}
                  />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-white/10">
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 border-b border-white/10"
              >
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Admin User</div>
              </motion.div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="gap-2 hover:bg-white/10 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 hover:bg-white/10 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="gap-2 text-destructive hover:bg-destructive/10 cursor-pointer">
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
