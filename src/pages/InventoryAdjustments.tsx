import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
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
import { useInventoryStore } from '@/stores/inventoryStore'

export default function InventoryAdjustments() {
  const { adjustments } = useInventoryStore()

  const getStatusColor = (status: string) => {
    return status === 'approved' ? 'success' : 'warning'
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

      <Button className="gap-2">
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
                    <TableHead>Adjustment #</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Counted</TableHead>
                    <TableHead className="text-right">System</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                        <TableCell className="font-medium">{adj.adjustmentNumber}</TableCell>
                        <TableCell>{adj.product}</TableCell>
                        <TableCell>{adj.location}</TableCell>
                        <TableCell className="text-right">{adj.countedQty}</TableCell>
                        <TableCell className="text-right">{adj.systemQty}</TableCell>
                        <TableCell className={`text-right font-semibold ${adj.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {adj.difference > 0 ? '+' : ''}{adj.difference}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(adj.status)}>{adj.status}</Badge>
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
