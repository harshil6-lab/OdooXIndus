import { motion } from 'framer-motion'
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
import { useInventoryStore } from '@/stores/inventoryStore'

export default function MoveHistory() {
  const { movements } = useInventoryStore()

  const getOperationColor = (type: string): 'success' | 'info' | 'default' | 'warning' => {
    const map: Record<string, 'success' | 'info' | 'default' | 'warning'> = {
      'receipt': 'success',
      'delivery': 'info',
      'transfer': 'default',
      'adjustment': 'warning',
    }
    return map[type] || 'default'
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
            <CardDescription>{movements.length} movements recorded</CardDescription>
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
                  {movements.map((movement) => (
                    <motion.tr
                      key={movement.id}
                      whileHover={{ backgroundColor: 'var(--accent)' }}
                      className="border-b border-border"
                    >
                      <TableCell className="text-sm text-muted-foreground">{movement.date}</TableCell>
                      <TableCell className="font-medium">{movement.product}</TableCell>
                      <TableCell>
                        <Badge variant={getOperationColor(movement.operationType)}>
                          {movement.operationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{movement.quantity}</TableCell>
                      <TableCell>{movement.warehouse}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{movement.reference}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
