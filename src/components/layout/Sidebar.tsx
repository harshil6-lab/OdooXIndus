import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  FileText,
  Truck,
  Boxes,
  History,
  Building2,
  Settings,
  User,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAppStore } from '@/stores/appStore'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
  },
  {
    id: 'products',
    label: 'Products',
    icon: <Package className="h-5 w-5" />,
    href: '/products',
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    children: [
      {
        id: 'receipts',
        label: 'Receipts',
        icon: <FileText className="h-5 w-5" />,
        href: '/receipts',
      },
      {
        id: 'delivery',
        label: 'Delivery Orders',
        icon: <Truck className="h-5 w-5" />,
        href: '/delivery',
      },
      {
        id: 'transfers',
        label: 'Internal Transfers',
        icon: <Boxes className="h-5 w-5" />,
        href: '/transfers',
      },
      {
        id: 'adjustments',
        label: 'Adjustments',
        icon: <Package className="h-5 w-5" />,
        href: '/adjustments',
      },
    ],
  },
  {
    id: 'history',
    label: 'Move History',
    icon: <History className="h-5 w-5" />,
    href: '/history',
  },
  {
    id: 'warehouses',
    label: 'Warehouses',
    icon: <Building2 className="h-5 w-5" />,
    href: '/warehouses',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="h-5 w-5" />,
    href: '/profile',
  },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['operations']))
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const location = useLocation()

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return location.pathname === href
  }

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full"
          >
            <motion.div
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                'text-foreground',
                depth > 0 && 'ml-4',
                isExpanded
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'hover:bg-white/5 border border-transparent hover:border-white/10'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ rotate: 6 }} className="text-primary">
                  {item.icon}
                </motion.div>
                {sidebarOpen && <span>{item.label}</span>}
              </div>
              {sidebarOpen && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              )}
            </motion.div>
          </button>
        ) : (
          <Link to={item.href || '/'} className="block">
            <motion.div
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                isActive(item.href)
                  ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-foreground hover:bg-white/5 border border-transparent hover:border-white/10',
                depth > 0 && 'ml-4'
              )}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: 6, scale: 1.1 }}
                className={isActive(item.href) ? 'text-primary' : ''}
              >
                {item.icon}
              </motion.div>
              {sidebarOpen && <span>{item.label}</span>}
            </motion.div>
          </Link>
        )}

        <AnimatePresence>
          {hasChildren && isExpanded && sidebarOpen && item.children && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Sidebar */}
      <motion.aside
        animate={{
          width: sidebarOpen ? 256 : 80,
          x: 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-30 flex flex-col border-r border-border bg-background pt-20 h-screen hidden lg:flex"
      >
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            CI
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-semibold text-foreground">CoreInventory</div>
              <div className="text-xs text-muted-foreground">IMS</div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigationItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
            {sidebarOpen && (
              <div className="text-sm">
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Admin</div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-20 bg-background/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-30 flex flex-col border-r border-border bg-background w-64 h-screen pt-20 lg:hidden"
            >
              {/* Logo Area */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  CI
                </div>
                <div>
                  <div className="font-semibold text-foreground">CoreInventory</div>
                  <div className="text-xs text-muted-foreground">IMS</div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navigationItems.map((item) => renderNavItem(item))}
              </nav>

              {/* Footer */}
              <div className="border-t border-border p-4">
                <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
                  <div className="text-sm">
                    <div className="font-medium">John Doe</div>
                    <div className="text-xs text-muted-foreground">Admin</div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
