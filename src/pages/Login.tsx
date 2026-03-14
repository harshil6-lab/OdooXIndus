import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.4-5.5 3.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 2.8 14.8 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.7-4.1 9.7-9.8 0-.7-.1-1.3-.2-2H12z" />
      <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.3-.2-2H12v3.9h5.5c-.3 1.4-1.2 2.6-2.4 3.4l3.7 2.9c2.2-2.1 3.2-5 3.2-8.2z" />
      <path fill="#FBBC05" d="M6 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9L6 14z" />
      <path fill="#34A853" d="M12 22c2.8 0 5.1-.9 6.9-2.5l-3.7-2.9c-1 .7-2.3 1.2-3.8 1.2-2.9 0-5.4-2-6.2-4.8l-3.8 3C3.2 19.7 7.2 22 12 22z" />
    </svg>
  )
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="2" width="9" height="9" fill="#F25022" />
      <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
      <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email])
  const passwordValid = password.length >= 8

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched({ email: true, password: true })
    if (!emailValid || !passwordValid) return

    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1600)
  }

  const updateOtp = (index: number, value: string) => {
    const next = value.replace(/\D/g, '').slice(0, 1)
    setOtp((current) => current.map((item, i) => (i === index ? next : item)))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#0b1630] to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-20 -left-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 35, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, -45, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        {Array.from({ length: 16 }).map((_, index) => (
          <motion.span
            key={`dot-${index}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-100/40"
            style={{ left: `${8 + (index % 8) * 12}%`, top: `${10 + Math.floor(index / 2) * 10}%` }}
            animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -8, 0] }}
            transition={{ duration: 2 + (index % 4), repeat: Infinity }}
          />
        ))}
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
            Logistics intelligence platform
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight">
            Manage your warehouse inventory with precision.
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Unify receipts, transfers, delivery orders, and stock controls in one enterprise-grade workflow engine.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-300">Trusted by 500+ warehouses across high-volume operations.</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-bold text-slate-950">
                CI
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Sign in to CoreInventory</h2>
              <p className="mt-1 text-sm text-slate-300">Welcome back to your operations workspace</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <input
                  id="loginEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                <label
                  htmlFor="loginEmail"
                  className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-cyan-200 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                  Email Address
                </label>
                <p className="mt-1 text-xs text-slate-300">
                  {touched.email && !emailValid ? 'Please enter a valid email.' : emailValid ? 'Valid email format.' : 'Use your work email.'}
                </p>
              </div>

              <div className="relative">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
                <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                <label
                  htmlFor="loginPassword"
                  className="pointer-events-none absolute left-10 top-3.5 text-sm text-slate-300 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-cyan-200 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
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
                  {touched.password && !passwordValid ? 'Minimum 8 characters required.' : passwordValid ? 'Strong password length.' : 'Use at least 8 characters.'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-slate-300">OTP Verification (UI only)</p>
                <div className="grid grid-cols-6 gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={`otp-login-${index}`}
                      value={digit}
                      onChange={(event) => updateOtp(index, event.target.value)}
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`OTP digit ${index + 1}`}
                      className="h-10 rounded-lg border border-white/20 bg-white/5 text-center text-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a href="#" className="text-xs text-cyan-200 hover:text-cyan-100">Forgot password?</a>
                <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                  Enterprise-grade security
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 font-semibold text-slate-950 transition hover:from-cyan-200 hover:to-blue-400 disabled:opacity-70"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-sm text-white transition hover:bg-white/10"
              >
                <GoogleMark />
                Continue with Google
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-sm text-white transition hover:bg-white/10"
              >
                <MicrosoftMark />
                Continue with Microsoft
              </motion.button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-300">
              Do not have an account?{' '}
              <Link to="/signup" className="font-medium text-cyan-200 hover:text-cyan-100">
                Sign up
              </Link>
            </p>
            <p className="mt-3 text-center text-xs text-slate-400">Trusted by 500+ warehouses</p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
