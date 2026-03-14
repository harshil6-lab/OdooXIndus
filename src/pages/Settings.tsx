import { motion } from 'framer-motion'
import { Bell, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Toggle } from '@/components/ui/Toggle'

export default function Settings() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and preferences</p>
        </div>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input defaultValue="Your Company" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Industry</label>
                  <Select>
                    <option>Logistics</option>
                    <option>Manufacturing</option>
                    <option>Retail</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" defaultValue="admin@company.com" className="mt-1" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Rules</CardTitle>
              <CardDescription>Configure inventory management behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Automatic Reordering</div>
                    <p className="text-sm text-muted-foreground">Automatically create purchase orders when stock falls below reorder level</p>
                  </div>
                  <Toggle defaultPressed />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Low Stock Alerts</div>
                    <p className="text-sm text-muted-foreground">Receive notifications for low stock items</p>
                  </div>
                  <Toggle defaultPressed />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Expiration Tracking</div>
                    <p className="text-sm text-muted-foreground">Track product expiration dates</p>
                  </div>
                  <Toggle />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reorder Thresholds</CardTitle>
              <CardDescription>Set system-wide reorder levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default Reorder Point (%)</label>
                <Input type="number" defaultValue="20" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Default Order Quantity</label>
                <Input type="number" defaultValue="100" className="mt-1" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Low Stock Alerts</span>
                    </div>
                  </div>
                  <Toggle defaultPressed />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Order Updates</span>
                    </div>
                  </div>
                  <Toggle defaultPressed />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>System Notifications</span>
                    </div>
                  </div>
                  <Toggle />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Manage security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Session Timeout (minutes)</label>
                <Input type="number" defaultValue="30" className="mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Two-Factor Authentication</span>
                  </div>
                </div>
                <Toggle />
              </div>

              <Button variant="destructive" className="gap-2">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
