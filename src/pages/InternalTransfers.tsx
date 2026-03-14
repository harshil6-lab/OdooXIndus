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
import { getCurrentUser } from '@/services/profileService'
import { supabase } from '@/services/supabaseClient'
import { Transfer } from '@/types/inventory'

export default function InternalTransfers() {
  const { products, warehouses, submitTransfer, loading: inventoryLoading } = useInventory()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loadingTransfers, setLoadingTransfers] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    quantity: 0,
    reference: '',
    note: '',
  })

  const fetchTransfers = async () => {
    setLoadingTransfers(true)
    try {
      const user = await getCurrentUser()
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransfers(data || [])
    } catch (err) {
      console.error('Failed to fetch transfers:', err)
    } finally {
      setLoadingTransfers(false)
    }
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  const handleSubmitTransfer = async () => {
    if (!formData.productId || !formData.sourceWarehouseId || !formData.destinationWarehouseId || !formData.quantity) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.sourceWarehouseId === formData.destinationWarehouseId) {
      alert('Source and destination warehouses must be different')
      return
    }

    setSubmitting(true)
    try {
      const success = await submitTransfer({
        productId: formData.productId,
        sourceWarehouseId: formData.sourceWarehouseId,
        destinationWarehouseId: formData.destinationWarehouseId,
        quantity: formData.quantity,
        reference: formData.reference || null,
        note: formData.note || null,
      })

      if (success) {
        setIsCreateOpen(false)
        setFormData({
          productId: '',
          sourceWarehouseId: '',
          destinationWarehouseId: '',
          quantity: 0,
          reference: '',
          note: '',
        })
        await fetchTransfers()
      }
    } catch (err) {
      alert('Failed to create transfer: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const loading = inventoryLoading || loadingTransfers

  if (loading && transfers.length === 0) {
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
          <h1 className="text-3xl font-bold tracking-tight">Internal Transfers</h1>
          <p className="text-muted-foreground">Move stock between warehouse locations</p>
        </div>
      </motion.div>

      <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Transfer
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transfers</CardTitle>
            <CardDescription>{transfers.length} transfers total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer ID</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transfers yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    transfers.map((transfer) => (
                      <motion.tr
                        key={transfer.id}
                        whileHover={{ backgroundColor: 'var(--accent)' }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-medium">{transfer.id.slice(0, 8)}...</TableCell>
                        <TableCell className="text-xs">{transfer.product_id.slice(0, 8)}...</TableCell>
                        <TableCell>{transfer.source_warehouse_id.slice(0, 8)}...</TableCell>
                        <TableCell>{transfer.destination_warehouse_id.slice(0, 8)}...</TableCell>
                        <TableCell className="text-right font-semibold">{transfer.quantity}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {transfer.created_at ? new Date(transfer.created_at).toLocaleDateString() : 'N/A'}
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

      {/* Create Transfer Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Transfer</DialogTitle>
            <DialogDescription>Transfer stock between warehouses</DialogDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">From Warehouse</label>
                <Select 
                  value={formData.sourceWarehouseId} 
                  onChange={(e) => setFormData({ ...formData, sourceWarehouseId: e.target.value })}
                >
                  <option value="">Select source</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">To Warehouse</label>
                <Select 
                  value={formData.destinationWarehouseId} 
                  onChange={(e) => setFormData({ ...formData, destinationWarehouseId: e.target.value })}
                >
                  <option value="">Select destination</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </Select>
              </div>
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
              <label className="text-sm font-medium">Reference (Optional)</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Transfer reference"
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
            <Button onClick={handleSubmitTransfer} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Transfer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
