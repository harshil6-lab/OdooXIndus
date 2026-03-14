import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
} from 'lucide-react'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Back button */}
      <Link to="/" className="absolute top-6 left-6 z-10">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 border border-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>
      </Link>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Glassmorphic Card */}
        <motion.div
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">CI</span>
            </div>
          </motion.div>

          {/* Progress indicator */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <span className="text-sm text-gray-400">
                Step {step} of 3
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="flex-1 h-1 rounded-full bg-white/10"
                  animate={{
                    backgroundColor: i <= step ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Step 1: Account Info */}
          {step === 1 && (
            <motion.form
              onSubmit={handleNext}
              className="space-y-4"
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-400 text-sm mb-6">
                Let's start with your basic information
              </p>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.form>
          )}

          {/* Step 2: Company Info */}
          {step === 2 && (
            <motion.form
              onSubmit={handleNext}
              className="space-y-4"
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-400 text-sm mb-6">
                Tell us about your warehouse
              </p>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    type="text"
                    placeholder="Your Company"
                    className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="industry" className="block text-sm font-medium text-white mb-2">
                  Industry
                </label>
                <select
                  id="industry"
                  aria-label="Select industry"
                  title="Select industry"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-colors focus:outline-none focus:border-blue-400/50"
                >
                  <option className="bg-slate-900">Manufacturing</option>
                  <option className="bg-slate-900">Logistics</option>
                  <option className="bg-slate-900">E-commerce</option>
                  <option className="bg-slate-900">Retail</option>
                  <option className="bg-slate-900">Other</option>
                </select>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-white/20 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <motion.form
              onSubmit={(e) => {
                e.preventDefault()
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 2000)
              }}
              className="space-y-4"
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="text-gray-400 text-sm mb-6">
                Secure your account with a strong password
              </p>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 text-sm"
              >
                <input
                  id="termsAccepted"
                  type="checkbox"
                  aria-label="Accept terms and privacy policy"
                  title="Accept terms and privacy policy"
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5"
                  required
                />
                <label htmlFor="termsAccepted" className="text-gray-400">
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-white/20 hover:bg-white/10 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-500/50 disabled:to-blue-600/50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Create Account
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          )}

          {/* Sign in link */}
          <motion.div variants={itemVariants} className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Security info */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-6"
        >
          🔒 Enterprise-grade security
        </motion.p>
      </motion.div>
    </div>
  )
}
