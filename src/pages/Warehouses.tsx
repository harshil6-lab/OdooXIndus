import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { useInventoryStore, Warehouse } from '@/stores/inventoryStore'

export default function Warehouses() {
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useInventoryStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    capacity: 0,
  })

  const handleOpen = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse)
      setFormData({
        name: warehouse.name,
        code: warehouse.code,
        location: warehouse.location,
        capacity: warehouse.capacity,
      })
    } else {
      setEditingWarehouse(null)
      setFormData({
        name: '',
        code: '',
        location: '',
        capacity: 0,
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, formData)
    } else {
      addWarehouse({
        id: Date.now().toString(),
        ...formData,
        currentUsage: 0,
      })
    }
    setIsOpen(false)
  }

  const getUsageWidthClass = (usage: number, capacity: number) => {
    const percentage = capacity > 0 ? (usage / capacity) * 100 : 0
    if (percentage >= 100) return 'w-full'
    if (percentage >= 90) return 'w-11/12'
    if (percentage >= 80) return 'w-10/12'
    if (percentage >= 70) return 'w-9/12'
    if (percentage >= 60) return 'w-8/12'
    if (percentage >= 50) return 'w-6/12'
    if (percentage >= 40) return 'w-5/12'
    if (percentage >= 30) return 'w-4/12'
    if (percentage >= 20) return 'w-3/12'
    if (percentage >= 10) return 'w-2/12'
    if (percentage > 0) return 'w-1/12'
    return 'w-0'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations and capacity</p>
        </div>
      </motion.div>

      <Button onClick={() => handleOpen()} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Warehouse
      </Button>

      <div className="grid gap-4 md:grid-cols-2">
        {warehouses.map((warehouse, idx) => (
          <motion.div
            key={warehouse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{warehouse.name}</CardTitle>
                    <CardDescription>{warehouse.location}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpen(warehouse)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteWarehouse(warehouse.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Code: {warehouse.code}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-medium">{warehouse.currentUsage} / {warehouse.capacity} units</span>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`bg-primary h-2 rounded-full transition-all ${getUsageWidthClass(warehouse.currentUsage, warehouse.capacity)}`}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  {Math.round((warehouse.currentUsage / warehouse.capacity) * 100)}% capacity used
                </div>

                {warehouse.temperature && (
                  <div className="flex justify-between text-xs">
                    <span>Temperature: {warehouse.temperature}</span>
                    <span>Humidity: {warehouse.humidity}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
            <DialogDescription>
              {editingWarehouse ? 'Update warehouse information' : 'Create a new warehouse location'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Warehouse Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="WH-001"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City/Address"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Capacity (units)</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingWarehouse ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
