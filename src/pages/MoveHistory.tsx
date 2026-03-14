import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useInventory } from '@/hooks/useInventory'

export default function MoveHistory() {
  const { ledger, products, warehouses, loading, error, refreshInventory } = useInventory()

  const getOperationColor = (type: string): 'success' | 'info' | 'default' | 'warning' => {
    const map: Record<string, 'success' | 'info' | 'default' | 'warning'> = {
      receipt: 'success',
      delivery: 'info',
      transfer: 'default',
      adjustment: 'warning',
    }
    return map[type] || 'default'
  }

  const resolveProductName = (id: string) => products.find((p) => p.id === id)?.name || id.slice(0, 8) + '...'
  const resolveWarehouseName = (id: string | null) => {
    if (!id) return 'N/A'
    return warehouses.find((w) => w.id === id)?.name || id.slice(0, 8) + '...'
  }

  if (loading && ledger.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">Error loading move history: {error}</p>
        <Button onClick={refreshInventory}>Retry</Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Move History</h1>
          <p className="text-muted-foreground">Complete audit trail of all stock movements</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Stock Movements</CardTitle>
            <CardDescription>{ledger.length} movements recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No movements recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    ledger.map((entry) => (
                      <motion.tr
                        key={entry.id}
                        whileHover={{ backgroundColor: 'var(--accent)' }}
                        className="border-b border-border"
                      >
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">{resolveProductName(entry.product_id)}</TableCell>
                        <TableCell>
                          <Badge variant={getOperationColor(entry.operation_type)}>
                            {entry.operation_type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${entry.quantity_delta > 0 ? 'text-green-600' : entry.quantity_delta < 0 ? 'text-red-600' : ''}`}>
                          {entry.quantity_delta > 0 ? '+' : ''}{entry.quantity_delta}
                        </TableCell>
                        <TableCell>{resolveWarehouseName(entry.warehouse_id)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.reference_type || 'N/A'}
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
    </div>
  )
}
