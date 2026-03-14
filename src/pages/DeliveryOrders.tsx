import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Eye, Loader2 } from 'lucide-react'
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
import { usePaginatedTable } from '@/hooks/usePaginatedTable'
import { useInventory } from '@/hooks/useInventory'
import { Delivery } from '@/types/inventory'

export default function DeliveryOrders() {
  const { products, submitDelivery, loading: inventoryLoading } = useInventory({ includeWarehouses: false, includeLedger: false, productPageSize: 100 })
  const { items: deliveries, loading: loadingDeliveries, error: fetchError, refresh: fetchDeliveries } = usePaginatedTable<Delivery>('deliveries')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    customer: '',
    reference: '',
    note: '',
  })

  const handleSubmitDelivery = async () => {
    if (!formData.productId || !formData.quantity) {
      alert('Please fill in required fields')
      return
    }

    setSubmitting(true)
    try {
      const success = await submitDelivery({
        productId: formData.productId,
        warehouseId: formData.warehouseId || null,
        quantity: formData.quantity,
        customer: formData.customer || null,
        reference: formData.reference || null,
        note: formData.note || null,
      })

      if (success) {
        setIsCreateOpen(false)
        setFormData({
          productId: '',
          warehouseId: '',
          quantity: 0,
          customer: '',
          reference: '',
          note: '',
        })
        await fetchDeliveries()
      }
    } catch (err) {
      alert('Failed to create delivery: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const loading = inventoryLoading || loadingDeliveries

  if (loading && deliveries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (fetchError && deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">Error loading deliveries: {fetchError}</p>
        <Button onClick={fetchDeliveries}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Delivery Orders</h1>
          <p className="text-muted-foreground">Manage outgoing shipments and orders</p>
        </div>
      </motion.div>

      {/* Action */}
      <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Order
      </Button>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Delivery Orders</CardTitle>
            <CardDescription>{deliveries.length} orders total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No orders yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    deliveries.map((delivery) => (
                      <motion.tr
                        key={delivery.id}
                        whileHover={{ backgroundColor: 'var(--accent)' }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-medium">{delivery.id.slice(0, 8)}...</TableCell>
                        <TableCell>{delivery.customer || 'N/A'}</TableCell>
                        <TableCell>{delivery.reference || 'N/A'}</TableCell>
                        <TableCell className="text-xs">{products.find(p => p.id === delivery.product_id)?.name || delivery.product_id.slice(0, 8) + '...'}</TableCell>
                        <TableCell className="text-right font-semibold">{delivery.quantity}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {delivery.created_at ? new Date(delivery.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDelivery(delivery)
                              setIsViewOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* Create Delivery Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Delivery Order</DialogTitle>
            <DialogDescription>Create a new outgoing delivery</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Select 
                value={formData.productId} 
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
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
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Customer (Optional)</label>
              <Input
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Customer name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reference (Optional)</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Order number or reference"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Note (Optional)</label>
              <Input
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Additional notes"
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitDelivery} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Delivery'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Delivery Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Order Details</DialogTitle>
            <DialogDescription>View delivery information</DialogDescription>
          </DialogHeader>

          {selectedDelivery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Order ID</label>
                  <p className="font-medium text-sm">{selectedDelivery.id}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Product ID</label>
                  <p className="font-medium text-sm">{selectedDelivery.product_id}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Quantity</label>
                  <p className="font-medium">{selectedDelivery.quantity}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Customer</label>
                  <p className="font-medium">{selectedDelivery.customer || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reference</label>
                  <p className="font-medium">{selectedDelivery.reference || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Created</label>
                  <p className="font-medium text-sm">
                    {selectedDelivery.created_at ? new Date(selectedDelivery.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedDelivery.note && (
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="mt-2 p-3 bg-muted/50 rounded text-sm">{selectedDelivery.note}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
