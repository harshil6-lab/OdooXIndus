import { motion } from 'framer-motion'
import { Mail, Briefcase, MapPin, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

export default function Profile() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60" />
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input defaultValue="John" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input defaultValue="Doe" className="mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input type="email" defaultValue="john.doe@company.com" className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Title
                </label>
                <Input defaultValue="Inventory Manager" className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Department
                </label>
                <Input defaultValue="Operations" className="mt-1" />
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Default View</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" aria-label="Select default view">
                  <option>Dashboard</option>
                  <option>Products</option>
                  <option>Operations</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Items Per Page</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" aria-label="Select items per page">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Date Format</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" aria-label="Select date format">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your account activity history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: 'Logged in', time: '2 hours ago' },
                { action: 'Created product: Laptop Pro', time: '1 day ago' },
                { action: 'Updated receipts', time: '2 days ago' },
              ].map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex justify-between p-3 rounded bg-muted/50"
                >
                  <span>{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full gap-2">
            <LogOut className="h-4 w-4" />
            Logout All Sessions
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
