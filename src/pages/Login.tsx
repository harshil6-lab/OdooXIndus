import { useMemo, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Mail, ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/services/supabaseClient'
import { getUserProfile, createUserProfile } from '@/services/profileService'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const otpInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('')

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email])

  // Redirect immediately if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const from = (location.state as any)?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      }
    })
  }, [navigate, location])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Try to get existing profile, create if doesn't exist
          try {
            await getUserProfile(session.user.id)
          } catch {
            // Profile doesn't exist, create it
            await createUserProfile({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || null,
            })
          }
          
          // Redirect to dashboard
          const from = (location.state as any)?.from?.pathname || '/dashboard'
          navigate(from, { replace: true })
        } catch (error) {
          console.error('Error handling auth:', error)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, location])

  // Auto-focus OTP input when OTP is sent
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [otpSent])

  const sendOTP = async (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    setError('')
    
    if (!emailValid) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) throw error

      setOtpSent(true)
      setError('')
      setOtpSuccessMsg(`OTP sent to ${email}`)
      setResendCooldown(30)
    } catch (error) {
      console.error('Error sending OTP:', error)
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    if (resendCooldown > 0 || isLoading) return
    setError('')
    setOtpSuccessMsg('')
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
      setOtpSuccessMsg(`New OTP sent to ${email}`)
      setResendCooldown(30)
      setOtp('')
    } catch (error) {
      console.error('Error resending OTP:', error)
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP code')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (error) throw error

      // Auth state listener will handle navigation
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setError((error as Error).message)
      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const sanitized = value.replace(/\D/g, '').slice(0, 6)
    setOtp(sanitized)
    
    // Auto-verify when 6 digits are entered
    if (sanitized.length === 6) {
      setTimeout(() => {
        // Create a synthetic event for auto-submit
        const form = document.getElementById('otp-form') as HTMLFormElement
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
        }
      }, 300)
    }
  }

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text')
    handleOtpChange(pastedData)
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
              <p className="mt-1 text-sm text-slate-300">
                {otpSent ? 'Enter the code sent to your email' : 'Welcome back to your operations workspace'}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={sendOTP} className="space-y-4">
                <div className="relative">
                  <input
                    id="loginEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder=" "
                    disabled={isLoading}
                    className={`peer h-12 w-full rounded-xl border bg-white/5 px-11 pt-4 text-sm text-white outline-none transition-all placeholder:text-transparent focus:ring-2 disabled:opacity-50 ${
                      touched && !emailValid
                        ? 'border-red-400/80 focus:ring-red-300/40'
                        : emailValid && touched
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
                  {touched && !emailValid && (
                    <p className="mt-1 text-xs text-red-400">Please enter a valid email address</p>
                  )}
                  {emailValid && touched && (
                    <p className="mt-1 text-xs text-emerald-400">Valid email format</p>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                    Enterprise-grade security
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !emailValid}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 font-semibold text-slate-950 transition hover:from-cyan-200 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    'Send OTP Code'
                  )}
                </motion.button>
              </form>
            ) : (
              <form id="otp-form" onSubmit={verifyOTP} className="space-y-4">
                {otpSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3"
                  >
                    <p className="text-sm text-emerald-400 text-center">{otpSuccessMsg}</p>
                  </motion.div>
                )}

                <div className="relative">
                  <input
                    ref={otpInputRef}
                    id="otpCode"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    onPaste={handleOtpPaste}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    autoComplete="one-time-code"
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/5 text-center text-2xl font-mono tracking-widest text-white outline-none transition-all focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-50"
                  />
                  <p className="mt-2 text-center text-xs text-slate-300">
                    Enter the 6-digit code sent to <span className="text-cyan-200">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 font-semibold text-slate-950 transition hover:from-cyan-200 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </motion.button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtp('')
                      setError('')
                      setOtpSuccessMsg('')
                      setResendCooldown(0)
                    }}
                    className="text-sm text-cyan-200 hover:text-cyan-100 transition"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-sm text-cyan-200 hover:text-cyan-100 transition disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}

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
