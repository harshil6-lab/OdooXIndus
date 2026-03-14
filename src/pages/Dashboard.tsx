import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Clock, Truck, Code2, Plus, FilePlus2, ArrowRightLeft } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { useInventoryStore } from '@/stores/inventoryStore'

const chartData = [
  { month: 'Jan', inventory: 4000, movement: 2400, orders: 2400 },
  { month: 'Feb', inventory: 3000, movement: 1398, orders: 2210 },
  { month: 'Mar', inventory: 2000, movement: 9800, orders: 2290 },
  { month: 'Apr', inventory: 2780, movement: 3908, orders: 2000 },
  { month: 'May', inventory: 1890, movement: 4800, orders: 2181 },
  { month: 'Jun', inventory: 2390, movement: 3800, orders: 2500 },
  { month: 'Jul', inventory: 3490, movement: 4300, orders: 2100 },
]

const lowStockData = [
  { id: '1', name: 'USB-C Cable', sku: 'USB-C-01', current: 8, recommended: 50 },
  { id: '2', name: 'HDMI Cable', sku: 'HDMI-01', current: 12, recommended: 30 },
  { id: '3', name: 'Power Adapter', sku: 'PSU-01', current: 5, recommended: 25 },
]

const recentOperations = [
  { id: '1', type: 'Receipt', reference: 'RCP-001', status: 'pending', items: 50, date: '2024-03-14' },
  { id: '2', type: 'Delivery', reference: 'ORD-001', status: 'in-progress', items: 5, date: '2024-03-13' },
  { id: '3', type: 'Transfer', reference: 'TRF-001', status: 'completed', items: 20, date: '2024-03-12' },
  { id: '4', type: 'Adjustment', reference: 'ADJ-001', status: 'approved', items: 3, date: '2024-03-11' },
]

const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  delay,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  description?: string
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group"
  >
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 shadow-lg hover:border-primary/50 hover:from-white/10 hover:to-white/5 transition-all duration-300">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          </div>
          <motion.div
            className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary group-hover:from-primary/30 group-hover:to-primary/20 transition-colors"
            whileHover={{ rotate: 6, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {Icon}
          </motion.div>
        </div>

        {/* Trend or Description */}
        {(trend || description) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs font-medium flex items-center gap-1 ${
              trend && trend > 0
                ? 'text-green-500 dark:text-green-400'
                : 'text-muted-foreground'
            }`}
          >
            {description && description}
            {trend && (
              <>
                <motion.div
                  animate={{ rotate: trend > 0 ? 0 : 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingUp className="h-3 w-3" />
                </motion.div>
                {trend > 0 ? '+' : ''}{trend}% vs last month
              </>
            )}
          </motion.p>
        )}
      </div>
    </div>
  </motion.div>
)

export default function Dashboard() {
  const { products, receipts, warehouses } = useInventoryStore()
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Code2 className="h-5 w-5" />,
      trend: 12,
      delay: 0.1,
    },
    {
      title: 'Low Stock Items',
      value: products.filter((p) => p.status === 'low-stock' || p.status === 'out-of-stock').length,
      icon: <AlertCircle className="h-5 w-5" />,
      description: 'Requires attention',
      delay: 0.2,
    },
    {
      title: 'Pending Receipts',
      value: receipts.filter((r) => r.status === 'pending').length,
      icon: <Clock className="h-5 w-5" />,
      description: 'Awaiting verification',
      delay: 0.3,
    },
    {
      title: 'Active Warehouses',
      value: warehouses.length,
      icon: <Truck className="h-5 w-5" />,
      trend: 2,
      delay: 0.4,
    },
  ]

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8, x: 20 }}
            className="fixed right-4 top-16 z-40 rounded-lg border border-blue-400/40 bg-slate-900/95 px-4 py-2 text-sm text-slate-100 shadow-xl backdrop-blur"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your inventory overview.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => setToast('Opening Add Product...')}
                className="group gap-2 bg-blue-600 hover:bg-blue-500"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Product
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => setToast('Opening Create Receipt...')}
                className="group gap-2 border-slate-700 bg-slate-900/70 hover:bg-slate-800"
              >
                <FilePlus2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                Create Receipt
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => setToast('Opening Transfer Stock...')}
                className="group gap-2 border-slate-700 bg-slate-900/70 hover:bg-slate-800"
              >
                <ArrowRightLeft className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Transfer Stock
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <KPICard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Inventory Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inventory Trend</CardTitle>
              <CardDescription>Monthly inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inventory"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorInventory)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Movement Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Movement Activity</CardTitle>
              <CardDescription>Stock movements vs orders</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="movement" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Low Stock & Recent Operations */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>{lowStockData.length} items below reorder level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.sku}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{item.current} / {item.recommended}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Operations</CardTitle>
              <CardDescription>Latest stock movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOperations.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium text-sm">{op.reference}</div>
                      <div className="text-xs text-muted-foreground">{op.type} • {op.items} items</div>
                    </div>
                    <Badge
                      variant={
                        op.status === 'completed'
                          ? 'success'
                          : op.status === 'pending'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {op.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Operations
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
