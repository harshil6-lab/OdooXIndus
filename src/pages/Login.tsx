import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
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

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your CoreInventory account</p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-blue-400/50"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-12 pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-blue-400/50"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Remember me & Forgot password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-500/50 disabled:to-blue-600/50 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* OAuth buttons */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10 text-white"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10 text-white"
            >
              Microsoft
            </Button>
          </motion.div>

          {/* Sign up link */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Security info */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-6"
        >
          🔒 Your data is encrypted and secure
        </motion.p>
      </motion.div>
    </div>
  )
}
