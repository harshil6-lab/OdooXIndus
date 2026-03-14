import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Eye, Loader2, Download } from 'lucide-react'
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
import { Receipt } from '@/types/inventory'
import { generateReceiptPDF } from '@/utils/pdfGenerator'

export default function Receipts() {
  const { products, submitReceipt, loading: inventoryLoading } = useInventory({ includeWarehouses: false, includeLedger: false, productPageSize: 100 })
  const { items: receipts, loading: loadingReceipts, error: fetchError, refresh: fetchReceipts } = usePaginatedTable<Receipt>('receipts')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    supplier: '',
    reference: '',
    note: '',
  })

  const handleSubmitReceipt = async () => {
    if (!formData.productId || !formData.quantity) {
      alert('Please fill in required fields')
      return
    }

    setSubmitting(true)
    try {
      const success = await submitReceipt({
        productId: formData.productId,
        warehouseId: formData.warehouseId || null,
        quantity: formData.quantity,
        supplier: formData.supplier || null,
        reference: formData.reference || null,
        note: formData.note || null,
      })

      if (success) {
        setIsCreateOpen(false)
        setFormData({
          productId: '',
          warehouseId: '',
          quantity: 0,
          supplier: '',
          reference: '',
          note: '',
        })
        await fetchReceipts()
      }
    } catch (err) {
      alert('Failed to create receipt: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadPDF = (receipt: Receipt) => {
    const product = products.find(p => p.id === receipt.product_id)
    const productName = product ? product.name : 'Unknown Product'
    
    generateReceiptPDF({
      receipt,
      productName,
      warehouseName: receipt.warehouse_id || undefined,
      supplierName: receipt.supplier || undefined,
    })
  }

  const loading = inventoryLoading || loadingReceipts

  if (loading && receipts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (fetchError && receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">Error loading receipts: {fetchError}</p>
        <Button onClick={fetchReceipts}>Retry</Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Receipts</h1>
          <p className="text-muted-foreground">Manage incoming goods and supplier shipments</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Receipt
        </Button>
      </motion.div>

      {/* Receipts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Incoming Receipts</CardTitle>
            <CardDescription>{receipts.length} receipts total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No receipts yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    receipts.map((receipt) => (
                      <motion.tr
                        key={receipt.id}
                        whileHover={{ backgroundColor: 'var(--accent)' }}
                        className="border-b border-border"
                      >
                        <TableCell className="font-medium">{receipt.id.slice(0, 8)}...</TableCell>
                        <TableCell>{receipt.supplier || 'N/A'}</TableCell>
                        <TableCell>{receipt.reference || 'N/A'}</TableCell>
                        <TableCell className="text-xs">{products.find(p => p.id === receipt.product_id)?.name || receipt.product_id.slice(0, 8) + '...'}</TableCell>
                        <TableCell className="text-right font-semibold">{receipt.quantity}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {receipt.created_at ? new Date(receipt.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReceipt(receipt)
                                setIsViewOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(receipt)}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Create Receipt Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Receipt</DialogTitle>
            <DialogDescription>Add a new incoming receipt</DialogDescription>
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
              <label className="text-sm font-medium">Supplier (Optional)</label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reference (Optional)</label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="PO number or reference"
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
            <Button onClick={handleSubmitReceipt} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Receipt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Receipt Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>View receipt information</DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Receipt ID</label>
                  <p className="font-medium text-sm">{selectedReceipt.id}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Product ID</label>
                  <p className="font-medium text-sm">{selectedReceipt.product_id}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Quantity</label>
                  <p className="font-medium">{selectedReceipt.quantity}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Supplier</label>
                  <p className="font-medium">{selectedReceipt.supplier || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reference</label>
                  <p className="font-medium">{selectedReceipt.reference || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Created</label>
                  <p className="font-medium text-sm">
                    {selectedReceipt.created_at ? new Date(selectedReceipt.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedReceipt.note && (
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="mt-2 p-3 bg-muted/50 rounded text-sm">{selectedReceipt.note}</p>
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
