import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  ArrowRight,
  Package,
  BarChart3,
  Zap,
  Shield,
  Users,
  Truck,
  TrendingUp,
} from 'lucide-react'

export default function Landing() {
  const stats = [
  { label: '500+', title: 'Companies Using' },
  { label: '10M+', title: 'Items Tracked' },
  { label: '99.9%', title: 'Uptime SLA' },
]

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const features = [
    {
      icon: Package,
      title: 'Smart Product Management',
      description: 'Track inventory across multiple warehouses with real-time updates',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Get insights into stock movements, trends, and warehouse efficiency',
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Move inventory between warehouses with a single click',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with role-based access controls',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user support with activity logs and approval workflows',
    },
    {
      icon: Truck,
      title: 'Receipt & Delivery',
      description: 'Streamline inbound and outbound logistics operations',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            y: [0, 100, -100, 0],
            x: [0, 50, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            y: [100, -100, 0, 100],
            x: [-50, 50, 0, -50],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 fixed top-0 left-0 right-0 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold">
              CI
            </div>
            <span className="text-xl font-bold">CoreInventory</span>
          </motion.div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <motion.div
            className="text-center max-w-4xl"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex justify-center"
            >
              <div className="px-4 py-2 rounded-full border border-blue-500/50 bg-blue-500/10 flex items-center gap-2 text-sm text-blue-200">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                New: Real-time inventory sync across all warehouses
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Smart Inventory Management for{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Modern Warehouses
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              The platform trusted by logistics leaders to streamline operations, reduce costs, and scale confidently. Built for teams that demand precision.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-4 justify-center mb-12"
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-8 h-12 flex items-center gap-2 group"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white text-lg px-8 h-12"
                >
                  Live Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-3 gap-8 py-12 border-t border-white/10 mt-12"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <div className="text-3xl font-bold text-blue-400">{stat.label}</div>
                    <div className="text-gray-400">{stat.title}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Enterprise Features for Every Team</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to manage complex warehouse operations at scale
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-blue-500/50 group"
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 6 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Warehouse?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join hundreds of companies already streamlining their operations with CoreInventory.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg px-12 h-12"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-6 text-center text-gray-400">
          <p>&copy; 2026 CoreInventory. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
