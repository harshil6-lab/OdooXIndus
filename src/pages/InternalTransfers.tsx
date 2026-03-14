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

export default function InternalTransfers() {
  const { transfers } = useInventoryStore()

  const getStatusColor = (status: string): 'warning' | 'info' | 'success' | 'default' => {
    const map: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
      'pending': 'warning',
      'in-transit': 'info',
      'completed': 'success',
    }
    return map[status] || 'default'
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

      <Button className="gap-2">
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
                    <TableHead>Transfer #</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead>Status</TableHead>
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
                        <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                        <TableCell>{transfer.fromWarehouse}</TableCell>
                        <TableCell>{transfer.toWarehouse}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{transfer.date}</TableCell>
                        <TableCell className="text-right">{transfer.items.length}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(transfer.status)}>{transfer.status}</Badge>
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
