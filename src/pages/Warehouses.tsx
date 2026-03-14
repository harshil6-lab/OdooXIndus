import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, MapPin, Loader2 } from 'lucide-react'
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
import { useWarehouses } from '@/hooks/useWarehouses'
import { Warehouse } from '@/types/inventory'

export default function Warehouses() {
  const { warehouses, loading, error, addWarehouse, editWarehouse, removeWarehouse } = useWarehouses()
  const [isOpen, setIsOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
  })

  const handleOpen = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse)
      setFormData({
        name: warehouse.name,
        location: warehouse.location || '',
        capacity: warehouse.capacity || 0,
      })
    } else {
      setEditingWarehouse(null)
      setFormData({
        name: '',
        location: '',
        capacity: 0,
      })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name) {
      alert('Please enter warehouse name')
      return
    }

    setSubmitting(true)
    try {
      if (editingWarehouse) {
        await editWarehouse(editingWarehouse.id, {
          name: formData.name,
          location: formData.location || null,
          capacity: formData.capacity || null,
        })
      } else {
        await addWarehouse({
          name: formData.name,
          location: formData.location || null,
          capacity: formData.capacity || null,
        })
      }
      setIsOpen(false)
      setEditingWarehouse(null)
      setFormData({ name: '', location: '', capacity: 0 })
    } catch (err) {
      alert('Failed to save warehouse: ' + (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) {
      return
    }

    try {
      const success = await removeWarehouse(id)
      if (!success) {
        alert('Failed to delete warehouse')
      }
    } catch (err) {
      alert('Failed to delete warehouse: ' + (err as Error).message)
    }
  }

  if (loading && warehouses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">Error loading warehouses: {error}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">Manage warehouse locations and capacity</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button onClick={() => handleOpen()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </motion.div>

      {warehouses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No warehouses yet</p>
                <p className="text-sm mt-2">Create your first warehouse to get started</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse, idx) => (
            <motion.div
              key={warehouse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{warehouse.name}</CardTitle>
                      {warehouse.location && (
                        <CardDescription className="flex items-center gap-1 mt-2">
                          <MapPin className="h-3 w-3" />
                          {warehouse.location}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpen(warehouse)}
                        title="Edit warehouse"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(warehouse.id)}
                        title="Delete warehouse"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {warehouse.capacity && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Capacity:</span>{' '}
                        <span className="font-medium">{warehouse.capacity} units</span>
                      </div>
                    )}
                    {warehouse.created_at && (
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(warehouse.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Warehouse Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
            <DialogDescription>
              {editingWarehouse ? 'Update warehouse information' : 'Create a new warehouse location'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Warehouse Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Warehouse"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., 123 Main St, City, State"
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
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsOpen(false)
                setEditingWarehouse(null)
                setFormData({ name: '', location: '', capacity: 0 })
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
