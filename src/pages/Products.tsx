import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { useInventoryStore, Product } from '@/stores/inventoryStore'

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    stock: 0,
    warehouse: '',
    reorderLevel: 0,
    price: 0,
  })

  const categories = ['Electronics', 'Accessories', 'Peripherals', 'Software']
  const warehouses = ['Main Warehouse', 'Secondary Warehouse']

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'success'
      case 'low-stock':
        return 'warning'
      case 'out-of-stock':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      stock: 0,
      warehouse: '',
      reorderLevel: 0,
      price: 0,
    })
    setIsAddOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: product.stock,
      warehouse: product.warehouse,
      reorderLevel: product.reorderLevel,
      price: product.price,
    })
    setIsEditOpen(true)
  }

  const handleSaveProduct = () => {
    if (!formData.name || !formData.sku || !formData.category) return

    if (editingProduct) {
      updateProduct(editingProduct.id, formData)
      setIsEditOpen(false)
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        status: formData.stock === 0 ? 'out-of-stock' : formData.stock <= formData.reorderLevel ? 'low-stock' : 'in-stock',
      }
      addProduct(newProduct)
      setIsAddOpen(false)
    }
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Products
          </h1>
          <p className="text-muted-foreground">Manage and track your inventory products</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Total Products', value: products.length },
          { label: 'In Stock', value: products.filter(p => p.status === 'in-stock').length },
          { label: 'Low Stock', value: products.filter(p => p.status === 'low-stock').length },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-4 hover:border-primary/50 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-col gap-3 flex-1 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              className="pl-11 bg-white/5 border-white/10 hover:border-white/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter products by category"
              title="Filter products by category"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 text-sm font-medium hover:border-white/20 transition-all focus:outline-none focus:border-primary/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleOpenAdd}
            className="gap-2 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Warehouse</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, idx) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="border-b border-white/5 transition-colors group hover:border-white/10"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-white/5 px-2 py-1 rounded border border-white/10 text-muted-foreground">
                            {product.sku}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground/70">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-foreground">{product.stock}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-foreground/70">{product.warehouse}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleOpenEdit(product)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddOpen || isEditOpen) && (
          <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
            if (!open) {
              setIsAddOpen(false)
              setIsEditOpen(false)
              setEditingProduct(null)
            }
          }}>
            <DialogContent className="bg-slate-900/95 border border-white/10 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? 'Update the product information'
                    : 'Create a new product and add it to your inventory'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Product Name
                  </label>
                  <Input
                    placeholder="e.g., USB-C Cable"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    SKU
                  </label>
                  <Input
                    placeholder="e.g., USB-C-01"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      aria-label="Select product category"
                      title="Select product category"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Warehouse
                    </label>
                    <select
                      value={formData.warehouse}
                      onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                      aria-label="Select warehouse"
                      title="Select warehouse"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                    >
                      <option value="">Select warehouse</option>
                      {warehouses.map((wh) => (
                        <option key={wh} value={wh}>
                          {wh}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Stock
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Reorder Level
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Price
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddOpen(false)
                    setIsEditOpen(false)
                    setEditingProduct(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProduct}
                  className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
