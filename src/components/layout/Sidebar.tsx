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
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
} from 'lucide-react'
import { useAuthUser } from '@/hooks/useAuthUser'
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
  const { profile, user } = useAuthUser()
  const location = useLocation()
  const desktopWidth = sidebarOpen ? 260 : 72
  const displayName = profile?.full_name || user?.email || 'Account'
  const displayRole = profile?.role || 'User'

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
    const anyChildActive = item.children?.some((child) => isActive(child.href))

    return (
      <div key={item.id} className="relative">
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full"
          >
            <motion.div
              className={cn(
                'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                depth > 0 && 'ml-4',
                isExpanded || anyChildActive
                  ? 'bg-slate-700/70 text-white'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {(isExpanded || anyChildActive) && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-blue-400" />
              )}
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className={cn('transition-colors', isExpanded || anyChildActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200')}
                >
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
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                depth > 0 && 'ml-4'
              )}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive(item.href) && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-blue-400" />
              )}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className={cn(isActive(item.href) ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-200')}
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
          width: desktopWidth,
          x: 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-30 hidden h-screen flex-col border-r border-slate-800/90 bg-slate-900 lg:flex"
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
              CI
            </div>
            {sidebarOpen && (
              <div className="leading-tight">
                <div className="truncate font-semibold text-slate-100">CoreInventory</div>
                <div className="text-xs text-slate-400">IMS</div>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          </motion.button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {navigationItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500" />
            {sidebarOpen && (
              <div className="text-sm leading-tight">
                <div className="font-medium text-slate-100">{displayName}</div>
                <div className="text-xs text-slate-400">{displayRole}</div>
              </div>
            )}
          </button>
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
              className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-slate-800 bg-slate-900 lg:hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                    CI
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold text-slate-100">CoreInventory</div>
                    <div className="text-xs text-slate-400">IMS</div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                {navigationItems.map((item) => renderNavItem(item))}
              </nav>

              <div className="border-t border-slate-800 p-3">
                <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-slate-800">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500" />
                  <div className="text-sm leading-tight">
                    <div className="font-medium text-slate-100">{displayName}</div>
                    <div className="text-xs text-slate-400">{displayRole}</div>
                  </div>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
