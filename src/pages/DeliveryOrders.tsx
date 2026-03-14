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
import { useInventoryStore } from '@/stores/inventoryStore'

export default function DeliveryOrders() {
  const { deliveryOrders } = useInventoryStore()

  const getStatusColor = (status: string): 'warning' | 'info' | 'success' | 'default' => {
    const map: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
      'pending': 'warning',
      'picked': 'info',
      'packed': 'info',
      'shipped': 'success',
      'delivered': 'success',
    }
    return map[status] || 'default'
  }

  const getStatusSteps = (status: string) => {
    const steps = ['pending', 'picked', 'packed', 'shipped', 'delivered']
    return steps.map(step => ({ step, completed: steps.indexOf(status) >= steps.indexOf(step) }))
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
      <Button className="gap-2">
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
            <CardDescription>{deliveryOrders.length} orders total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      whileHover={{ backgroundColor: 'var(--accent)' }}
                      className="border-b border-border"
                    >
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                      <TableCell className="text-right">{order.items.length}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
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
    </div>
  )
}
