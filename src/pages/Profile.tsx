import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Briefcase, MapPin, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { supabase } from '@/services/supabaseClient'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    department: 'Operations'
  })

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        
        if (user) {
          setUser(user)
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            
          if (profileError && profileError.code !== 'PGRST116') {
             throw profileError
          }
          
          setProfile(profileData || null)
          
          const fullName = profileData?.full_name || ''
          const parts = fullName.split(' ')
          setFormData({
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            role: profileData?.role || '',
            department: 'Operations'
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, role: formData.role })
        .eq("id", user.id)
        
      if (error) throw error
      setProfile((prev: any) => ({ ...prev, full_name: fullName, role: formData.role }))
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-white uppercase">
                  {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input type="email" value={user?.email || ''} readOnly disabled className="mt-1 bg-muted" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Title
                </label>
                <Input name="role" value={formData.role} onChange={handleChange} className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Department
                </label>
                <Input name="department" value={formData.department} onChange={handleChange} className="mt-1" />
              </div>

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
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
