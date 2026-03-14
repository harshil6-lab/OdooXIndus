import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail, MapPin, User, Warehouse, Users, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/services/supabaseClient'
import { getOrCreateProfile } from '@/services/profileService'

type SignupForm = {
  name: string
  email: string
  password: string
  warehouseName: string
  location: string
  industry: string
  invites: string
  role: string
}

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    warehouseName: '',
    location: '',
    industry: '',
    invites: '',
    role: '',
  })

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email])
  const passwordValid = form.password.length >= 8

  const stepValid = () => {
    if (step === 1) return form.name.trim().length >= 2 && emailValid && passwordValid
    if (step === 2) return form.warehouseName.trim().length >= 2 && form.location.trim().length >= 2 && !!form.industry
    if (step === 3) return !!form.role
    return false
  }

  const setField = (key: keyof SignupForm, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const next = (event: React.FormEvent) => {
    event.preventDefault()
    if (!stepValid()) {
      if (step === 1) setTouched((old) => ({ ...old, name: true, email: true, password: true }))
      if (step === 2) setTouched((old) => ({ ...old, warehouseName: true, location: true, industry: true }))
      if (step === 3) setTouched((old) => ({ ...old, role: true }))
      return
    }
    setStep((old) => Math.min(old + 1, 3))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stepValid()) return
    
    setLoading(true)
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned from signup')

      // Get or create user profile (safe method that checks if profile exists)
      const profile = await getOrCreateProfile(authData.user.id, form.email)
      
      // Update profile with additional data from form
      await supabase
        .from('profiles')
        .update({
          full_name: form.name,
          company_name: form.warehouseName,
          role: form.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.user.id)

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup failed:', error)
      alert('Signup failed: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#0d1835] to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -24, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
      </div>

      <Link to="/landing" className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="border border-white/20 bg-white/5 text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>
      </Link>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <p className="inline-flex rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1.5 text-xs text-cyan-100">
            Three-step onboarding
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight">Launch warehouse operations in minutes</h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Configure your facility, invite your team, and start tracking inventory flows with enterprise controls.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-300">Trusted by 500+ warehouses and growing logistics teams.</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-bold text-slate-950">
                CI
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Create your account</h2>
              <p className="mt-1 text-sm text-slate-300">Step {step} of 3</p>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                <span>{step === 1 ? 'User Details' : step === 2 ? 'Warehouse Setup' : 'Team Setup'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={next} className="space-y-4">
                <div className="relative">
                  <input
                    id="signupName"
                    type="text"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    onBlur={() => setTouched((old) => ({ ...old, name: true }))}
                    placeholder=" "
                    className={`peer h-12 w-full rounded-xl border bg-white/5 px-11 pt-4 text-sm text-white outline-none transition-all placeholder:text-transparent focus:ring-2 ${
                      touched.name && form.name.trim().length < 2
                        ? 'border-red-400/80 focus:ring-red-300/40'
                        : form.name.trim().length >= 2 && touched.name
                          ? 'border-emerald-400/70 focus:ring-emerald-300/40'
                          : 'border-white/20 focus:border-cyan-300/70 focus:ring-cyan-300/30'
                    }`}
                  />
                  <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                  <label htmlFor="signupName" className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Name
                  </label>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.name && form.name.trim().length < 2 ? 'Enter at least 2 characters.' : form.name.trim().length >= 2 ? 'Looks good.' : 'Your full name.'}
                  </p>
                </div>

                <div className="relative">
                  <input
                    id="signupEmail"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    onBlur={() => setTouched((old) => ({ ...old, email: true }))}
                    placeholder=" "
                    className={`peer h-12 w-full rounded-xl border bg-white/5 px-11 pt-4 text-sm text-white outline-none transition-all placeholder:text-transparent focus:ring-2 ${
                      touched.email && !emailValid
                        ? 'border-red-400/80 focus:ring-red-300/40'
                        : emailValid && touched.email
                          ? 'border-emerald-400/70 focus:ring-emerald-300/40'
                          : 'border-white/20 focus:border-cyan-300/70 focus:ring-cyan-300/30'
                    }`}
                  />
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                  <label htmlFor="signupEmail" className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Email Address
                  </label>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.email && !emailValid ? 'Enter a valid email.' : emailValid ? 'Valid email format.' : 'Use your work email.'}
                  </p>
                </div>

                <div className="relative">
                  <input
                    id="signupPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setField('password', e.target.value)}
                    onBlur={() => setTouched((old) => ({ ...old, password: true }))}
                    placeholder=" "
                    className={`peer h-12 w-full rounded-xl border bg-white/5 px-11 pr-12 pt-4 text-sm text-white outline-none transition-all placeholder:text-transparent focus:ring-2 ${
                      touched.password && !passwordValid
                        ? 'border-red-400/80 focus:ring-red-300/40'
                        : passwordValid && touched.password
                          ? 'border-emerald-400/70 focus:ring-emerald-300/40'
                          : 'border-white/20 focus:border-cyan-300/70 focus:ring-cyan-300/30'
                    }`}
                  />
                  <Eye className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300 opacity-0" />
                  <label htmlFor="signupPassword" className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((old) => !old)}
                    className="absolute right-3 top-3 rounded-md p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.password && !passwordValid ? 'Minimum 8 characters required.' : passwordValid ? 'Strong enough.' : 'Create a secure password.'}
                  </p>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 font-semibold text-slate-950">
                  Continue
                </motion.button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={next} className="space-y-4">
                <div className="relative">
                  <input
                    id="warehouseName"
                    type="text"
                    value={form.warehouseName}
                    onChange={(e) => setField('warehouseName', e.target.value)}
                    onBlur={() => setTouched((old) => ({ ...old, warehouseName: true }))}
                    placeholder=" "
                    className="peer h-12 w-full rounded-xl border border-white/20 bg-white/5 px-11 pt-4 text-sm text-white outline-none transition-all placeholder:text-transparent focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <Warehouse className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                  <label htmlFor="warehouseName" className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Warehouse Name
                  </label>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.warehouseName && form.warehouseName.trim().length < 2 ? 'Please enter warehouse name.' : 'Primary facility name.'}
                  </p>
                </div>

                <div className="relative">
                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(e) => setField('location', e.target.value)}
                    onBlur={() => setTouched((old) => ({ ...old, location: true }))}
                    placeholder=" "
                    className="peer h-12 w-full rounded-xl border border-white/20 bg-white/5 px-11 pt-4 text-sm text-white outline-none transition-all placeholder:text-transparent focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                  <label htmlFor="location" className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Location
                  </label>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.location && form.location.trim().length < 2 ? 'Please enter location.' : 'City, region, or site code.'}
                  </p>
                </div>

                <div>
                  <label htmlFor="industry" className="mb-1 block text-xs text-slate-300">Industry Type</label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => setField('industry', e.target.value)}
                    onBlur={() => setTouched((old) => ({ ...old, industry: true }))}
                    className={`h-12 w-full rounded-xl border bg-white/5 px-3 text-sm text-white outline-none transition-all focus:ring-2 ${
                      touched.industry && !form.industry ? 'border-red-400/80 focus:ring-red-300/40' : 'border-white/20 focus:border-cyan-300/70 focus:ring-cyan-300/30'
                    }`}
                    aria-label="Industry Type"
                    title="Industry Type"
                  >
                    <option value="" className="bg-slate-900">Select Industry</option>
                    <option value="logistics" className="bg-slate-900">Logistics</option>
                    <option value="manufacturing" className="bg-slate-900">Manufacturing</option>
                    <option value="retail" className="bg-slate-900">Retail</option>
                    <option value="ecommerce" className="bg-slate-900">E-commerce</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.industry && !form.industry ? 'Please select industry type.' : 'Used to configure smart defaults.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setStep(1)} className="h-12 rounded-xl border border-white/20 bg-white/5 text-sm text-white">
                    Back
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="h-12 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-sm font-semibold text-slate-950">
                    Continue
                  </motion.button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={submit} className="space-y-4">
                <div className="relative">
                  <textarea
                    id="invites"
                    value={form.invites}
                    onChange={(e) => setField('invites', e.target.value)}
                    placeholder="alex@company.com, jordan@company.com"
                    className="h-24 w-full resize-none rounded-xl border border-white/20 bg-white/5 p-3 text-sm text-white outline-none transition-all focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <label htmlFor="invites" className="mb-1 block text-xs text-slate-300">Invite Team Members</label>
                  <p className="mt-1 text-xs text-slate-300">Optional: add emails separated by commas.</p>
                </div>

                <div>
                  <label htmlFor="role" className="mb-1 block text-xs text-slate-300">Role Selection</label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                    <select
                      id="role"
                      value={form.role}
                      onChange={(e) => setField('role', e.target.value)}
                      onBlur={() => setTouched((old) => ({ ...old, role: true }))}
                      className={`h-12 w-full rounded-xl border bg-white/5 pl-10 pr-3 text-sm text-white outline-none transition-all focus:ring-2 ${
                        touched.role && !form.role ? 'border-red-400/80 focus:ring-red-300/40' : 'border-white/20 focus:border-cyan-300/70 focus:ring-cyan-300/30'
                      }`}
                      aria-label="Role Selection"
                      title="Role Selection"
                    >
                      <option value="" className="bg-slate-900">Select Role</option>
                      <option value="inventory-manager" className="bg-slate-900">Inventory Manager</option>
                      <option value="warehouse-admin" className="bg-slate-900">Warehouse Admin</option>
                      <option value="operator" className="bg-slate-900">Warehouse Operator</option>
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {touched.role && !form.role ? 'Please choose a role.' : 'Default role for your account.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setStep(2)} className="h-12 rounded-xl border border-white/20 bg-white/5 text-sm text-white">
                    Back
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="h-12 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-sm font-semibold text-slate-950 disabled:opacity-70">
                    {loading ? 'Creating account...' : 'Create Account'}
                  </motion.button>
                </div>
              </form>
            )}

            <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-cyan-200 hover:text-cyan-100">Sign in</Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />
              Enterprise-grade security
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
