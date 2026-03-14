import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Clock, Truck, Code2, Plus, FilePlus2, ArrowRightLeft, Loader2 } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useInventory } from '@/hooks/useInventory'
import { Product } from '@/types/inventory'

const chartData = [
  { month: 'Jan', inventory: 4000, movement: 2400, orders: 2400 },
  { month: 'Feb', inventory: 3000, movement: 1398, orders: 2210 },
  { month: 'Mar', inventory: 2000, movement: 9800, orders: 2290 },
  { month: 'Apr', inventory: 2780, movement: 3908, orders: 2000 },
  { month: 'May', inventory: 1890, movement: 4800, orders: 2181 },
  { month: 'Jun', inventory: 2390, movement: 3800, orders: 2500 },
  { month: 'Jul', inventory: 3490, movement: 4300, orders: 2100 },
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
  const { products, warehouses, ledger, loading, error, refreshInventory, submitReceipt, submitTransfer } = useInventory()
  const [toast, setToast] = useState<string | null>(null)
  
  // Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isCreateReceiptOpen, setIsCreateReceiptOpen] = useState(false)
  const [isTransferStockOpen, setIsTransferStockOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    reorder_level: 0,
  })
  
  const [receiptForm, setReceiptForm] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    supplier: '',
    reference: '',
  })
  
  const [transferForm, setTransferForm] = useState({
    productId: '',
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    quantity: 0,
    reference: '',
  })

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.sku || !productForm.category) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const { createProduct } = await import('@/services/productService')
      await createProduct({
        name: productForm.name,
        sku: productForm.sku,
        category: productForm.category,
        price: productForm.price,
        reorder_level: productForm.reorder_level,
        stock: 0,
        warehouse_id: null,
      })
      
      setIsAddProductOpen(false)
      setProductForm({ name: '', sku: '', category: '', price: 0, reorder_level: 0 })
      await refreshInventory()
      setToast('Product added successfully!')
    } catch (err) {
      alert('Failed to add product: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateReceipt = async () => {
    if (!receiptForm.productId || !receiptForm.quantity) {
      alert('Please fill in required fields')
      return
    }

    setSubmitting(true)
    try {
      await submitReceipt({
        productId: receiptForm.productId,
        warehouseId: receiptForm.warehouseId || null,
        quantity: receiptForm.quantity,
        supplier: receiptForm.supplier || null,
        reference: receiptForm.reference || null,
        note: null,
      })
      
      setIsCreateReceiptOpen(false)
      setReceiptForm({ productId: '', warehouseId: '', quantity: 0, supplier: '', reference: '' })
      setToast('Receipt created successfully!')
    } catch (err) {
      alert('Failed to create receipt: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTransferStock = async () => {
    if (!transferForm.productId || !transferForm.sourceWarehouseId || !transferForm.destinationWarehouseId || !transferForm.quantity) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      await submitTransfer({
        productId: transferForm.productId,
        sourceWarehouseId: transferForm.sourceWarehouseId,
        destinationWarehouseId: transferForm.destinationWarehouseId,
        quantity: transferForm.quantity,
        reference: transferForm.reference || null,
        note: null,
      })
      
      setIsTransferStockOpen(false)
      setTransferForm({ productId: '', sourceWarehouseId: '', destinationWarehouseId: '', quantity: 0, reference: '' })
      setToast('Stock transferred successfully!')
    } catch (err) {
      alert('Failed to transfer stock: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const getProductStatus = (product: Product) => {
    if (product.stock === 0) return 'out-of-stock'
    if (product.stock <= product.reorder_level) return 'low-stock'
    return 'in-stock'
  }

  const lowStockProducts = products.filter(p => getProductStatus(p) === 'low-stock' || getProductStatus(p) === 'out-of-stock')
  const recentOperations = ledger.slice(0, 4).map((entry, idx) => ({
    id: entry.id || idx.toString(),
    type: entry.operation_type.charAt(0).toUpperCase() + entry.operation_type.slice(1),
    reference: entry.reference_id || 'N/A',
    status: entry.quantity_delta > 0 ? 'completed' : 'completed',
    items: Math.abs(entry.quantity_delta),
    date: entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A',
  }))

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
      value: lowStockProducts.length,
      icon: <AlertCircle className="h-5 w-5" />,
      description: 'Requires attention',
      delay: 0.2,
    },
    {
      title: 'Recent Operations',
      value: ledger.length,
      icon: <Clock className="h-5 w-5" />,
      description: 'Total logged',
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">Error loading dashboard data: {error}</p>
        <Button onClick={refreshInventory}>Retry</Button>
      </div>
    )
  }

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
                onClick={() => setIsAddProductOpen(true)}
                className="group gap-2 bg-blue-600 hover:bg-blue-500"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Product
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => setIsCreateReceiptOpen(true)}
                className="group gap-2 border-slate-700 bg-slate-900/70 hover:bg-slate-800"
              >
                <FilePlus2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                Create Receipt
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => setIsTransferStockOpen(true)}
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
              <CardDescription>{lowStockProducts.length} items below reorder level</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  All products have sufficient stock
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.sku}</div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">{item.stock} / {item.reorder_level}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  {lowStockProducts.length > 3 && (
                    <Button className="w-full mt-4" variant="outline">
                      View All Alerts ({lowStockProducts.length})
                    </Button>
                  )}
                </>
              )}
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
              {recentOperations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No operations yet
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {recentOperations.map((op) => (
                      <div key={op.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium text-sm">{op.reference}</div>
                          <div className="text-xs text-muted-foreground">{op.type} • {op.items} units</div>
                        </div>
                        <Badge variant="success">
                          {op.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {ledger.length > 4 && (
                    <Button className="w-full mt-4" variant="outline">
                      View All Operations ({ledger.length})
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Create a new product in inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Enter product name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">SKU *</label>
              <Input
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                placeholder="Enter SKU"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <Input
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                placeholder="Enter category"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reorder Level</label>
                <Input
                  type="number"
                  value={productForm.reorder_level}
                  onChange={(e) => setProductForm({ ...productForm, reorder_level: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                  min="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Receipt Dialog */}
      <Dialog open={isCreateReceiptOpen} onOpenChange={setIsCreateReceiptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Receipt</DialogTitle>
            <DialogDescription>Record incoming inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product *</label>
              <Select
                value={receiptForm.productId}
                onChange={(e) => setReceiptForm({ ...receiptForm, productId: e.target.value })}
                className="mt-1"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                type="number"
                value={receiptForm.quantity}
                onChange={(e) => setReceiptForm({ ...receiptForm, quantity: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Supplier</label>
              <Input
                value={receiptForm.supplier}
                onChange={(e) => setReceiptForm({ ...receiptForm, supplier: e.target.value })}
                placeholder="Supplier name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reference</label>
              <Input
                value={receiptForm.reference}
                onChange={(e) => setReceiptForm({ ...receiptForm, reference: e.target.value })}
                placeholder="Reference number"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateReceiptOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateReceipt} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Receipt'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Stock Dialog */}
      <Dialog open={isTransferStockOpen} onOpenChange={setIsTransferStockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
            <DialogDescription>Move inventory between warehouses</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product *</label>
              <Select
                value={transferForm.productId}
                onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
                className="mt-1"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Source Warehouse *</label>
              <Select
                value={transferForm.sourceWarehouseId}
                onChange={(e) => setTransferForm({ ...transferForm, sourceWarehouseId: e.target.value })}
                className="mt-1"
              >
                <option value="">Select source warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Destination Warehouse *</label>
              <Select
                value={transferForm.destinationWarehouseId}
                onChange={(e) => setTransferForm({ ...transferForm, destinationWarehouseId: e.target.value })}
                className="mt-1"
              >
                <option value="">Select destination warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                type="number"
                value={transferForm.quantity}
                onChange={(e) => setTransferForm({ ...transferForm, quantity: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reference</label>
              <Input
                value={transferForm.reference}
                onChange={(e) => setTransferForm({ ...transferForm, reference: e.target.value })}
                placeholder="Reference number"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferStockOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleTransferStock} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                'Transfer Stock'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
