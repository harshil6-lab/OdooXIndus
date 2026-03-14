import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Eye } from 'lucide-react'
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
import { useInventoryStore } from '@/stores/inventoryStore'

export default function Receipts() {
  const { receipts, products } = useInventoryStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [formData, setFormData] = useState({
    supplier: '',
    productId: '',
    quantity: 0,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'received':
        return 'info'
      case 'verified':
        return 'success'
      default:
        return 'default'
    }
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
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <motion.tr
                      key={receipt.id}
                      whileHover={{ backgroundColor: 'var(--accent)' }}
                      className="border-b border-border"
                    >
                      <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                      <TableCell>{receipt.supplier}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{receipt.date}</TableCell>
                      <TableCell className="text-right font-semibold">{receipt.totalItems}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(receipt.status)}>{receipt.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
                      </TableCell>
                    </motion.tr>
                  ))}
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
              <label className="text-sm font-medium">Supplier</label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Enter supplier name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Product</label>
              <Select value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })}>
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>Create Receipt</Button>
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
                  <label className="text-xs text-muted-foreground">Receipt #</label>
                  <p className="font-medium">{selectedReceipt.receiptNumber}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Supplier</label>
                  <p className="font-medium">{selectedReceipt.supplier}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Date</label>
                  <p className="font-medium">{selectedReceipt.date}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <Badge variant={getStatusColor(selectedReceipt.status)}>{selectedReceipt.status}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Items</label>
                <div className="mt-2 space-y-2">
                  {selectedReceipt.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-2 bg-muted-foreground/10 rounded">
                      <span>{item.productName}</span>
                      <span>{item.quantity} units</span>
                    </div>
                  ))}
                </div>
              </div>
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
