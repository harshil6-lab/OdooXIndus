import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
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
import { supabase } from '@/services/supabaseClient'
import { Adjustment } from '@/types/inventory'

export default function InventoryAdjustments() {
  const { products, submitAdjustment, loading: inventoryLoading } = useInventory()
  const [adjustments, setAdjustments] = useState<Adjustment[]>([])
  const [loadingAdjustments, setLoadingAdjustments] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    countedStock: 0,
    reason: '',
    reference: '',
  })

  const fetchAdjustments = async () => {
    setLoadingAdjustments(true)
    try {
      const { data, error } = await supabase
        .from('adjustments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdjustments(data || [])
    } catch (err) {
      console.error('Failed to fetch adjustments:', err)
    } finally {
      setLoadingAdjustments(false)
    }
  }

  useEffect(() => {
    fetchAdjustments()
  }, [])

  const handleSubmitAdjustment = async () => {
    if (!formData.productId || formData.countedStock < 0) {
      alert('Please fill in all required fields with valid values')
      return
    }

    setSubmitting(true)
    try {
      const success = await submitAdjustment({
        productId: formData.productId,
        warehouseId: formData.warehouseId || null,
        countedStock: formData.countedStock,
        reason: formData.reason || null,
        reference: formData.reference || null,
      })

      if (success) {
        setIsCreateOpen(false)
        setFormData({
          productId: '',
          warehouseId: '',
          countedStock: 0,
          reason: '',
          reference: '',
        })
        await fetchAdjustments()
      }
    } catch (err) {
      alert('Failed to create adjustment: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const loading = inventoryLoading || loadingAdjustments

  if (loading && adjustments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }



  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Inventory Adjustments</h1>
          <p className="text-muted-foreground">Handle stock corrections and physical count discrepancies</p>
        </div>
      </motion.div>

      <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Adjustment
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Adjustments</CardTitle>
            <CardDescription>{adjustments.length} adjustments total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adjustment ID</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead className="text-right">Previous Stock</TableHead>
                    <TableHead className="text-right">New Stock</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No adjustments yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    adjustments.map((adj) => (
                      <motion.tr
                        key={adj.id}
                        whileHover={{ backgroundColor: 'var(--accent)' }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-medium">{adj.id.slice(0, 8)}...</TableCell>
                        <TableCell className="text-xs">{adj.product_id.slice(0, 8)}...</TableCell>
                        <TableCell className="text-right">{adj.previous_stock}</TableCell>
                        <TableCell className="text-right">{adj.new_stock}</TableCell>
                        <TableCell className={`text-right font-semibold ${adj.difference > 0 ? 'text-green-600' : adj.difference < 0 ? 'text-red-600' : ''}`}>
                          {adj.difference > 0 ? '+' : ''}{adj.difference}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {adj.created_at ? new Date(adj.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Adjustment Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Adjustment</DialogTitle>
            <DialogDescription>Adjust stock levels for physical count discrepancies</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Select 
                value={formData.productId} 
                onChange={(e) => {
                  const selectedProduct = products.find(p => p.id === e.target.value)
                  setFormData({ 
                    ...formData, 
                    productId: e.target.value,
                    countedStock: selectedProduct?.stock || 0
                  })
                }}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - Current: {product.stock}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Counted Stock</label>
              <Input
                type="number"
                value={formData.countedStock}
                onChange={(e) => setFormData({ ...formData, countedStock: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="0"
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">System Stock:</span>
                  <span className="font-medium">{products.find(p => p.id === formData.productId)?.stock || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Difference:</span>
                  <span className={`font-semibold ${(formData.countedStock - (products.find(p => p.id === formData.productId)?.stock || 0)) > 0 ? 'text-green-600' : (formData.countedStock - (products.find(p => p.id === formData.productId)?.stock || 0)) < 0 ? 'text-red-600' : ''}`}>
                    {(formData.countedStock - (products.find(p => p.id === formData.productId)?.stock || 0)) > 0 ? '+' : ''}
                    {formData.countedStock - (products.find(p => p.id === formData.productId)?.stock || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Reason (Optional)</label>
              <Input
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Physical count, Damage, Theft"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reference (Optional)</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Adjustment reference"
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAdjustment} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Adjustment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
