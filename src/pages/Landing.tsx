import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  ArrowRight,
  PlayCircle,
  ChevronRight,
  Package,
  Layers,
  Truck,
  Activity,
  Building2,
  Boxes,
  BarChart3,
  TrendingUp,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react'

function MetricCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    const duration = 1200
    const steps = 45
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
        return
      }
      setCount(Math.floor(current))
    }, duration / steps)

    return () => clearInterval(timer)
  }, [end, inView])

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-7 backdrop-blur-xl"
    >
      <p className="text-4xl font-semibold tracking-tight text-white">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </div>
  )
}

export default function Landing() {
  const navItems = ['Features', 'Product', 'Pricing', 'Docs', 'Contact']

  const features = [
    {
      icon: Package,
      title: 'Product Management',
      description: 'Organize SKUs, variants, and reorder logic from one operational workspace.',
    },
    {
      icon: Layers,
      title: 'Real-time Stock Tracking',
      description: 'Monitor quantity shifts and reservation changes with second-level precision.',
    },
    {
      icon: Truck,
      title: 'Warehouse Transfers',
      description: 'Move items across facilities with guided transfer workflows and approvals.',
    },
    {
      icon: Activity,
      title: 'Stock Analytics',
      description: 'Visualize throughput, dead stock, and demand trends in executive-ready dashboards.',
    },
  ]

  const productHighlights = [
    'Product Management',
    'Real-time Inventory Tracking',
    'Warehouse Transfers',
    'Stock Analytics',
  ]

  const particles = Array.from({ length: 18 }).map((_, i) => i)

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl"
          animate={{ x: [0, 60, -20, 0], y: [0, 40, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-28 right-0 h-[460px] w-[460px] rounded-full bg-blue-600/20 blur-3xl"
          animate={{ x: [0, -80, 20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/landing" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30">
              CI
            </div>
            <span className="text-lg font-semibold tracking-tight">CoreInventory</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="group relative text-sm text-slate-200 transition-colors hover:text-white"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-cyan-300 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-100 hover:bg-white/10 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-300 hover:to-blue-400">
                  Start Free Trial
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[88vh] w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="mb-5 inline-flex w-fit items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-medium tracking-wide text-cyan-100">
              Built for enterprise logistics teams
            </span>

            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Smart Inventory Management for Modern Warehouses
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
              Run every warehouse operation from one intelligent control plane. Optimize receipts, transfers, delivery orders, and stock visibility in real time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Button className="group h-12 bg-gradient-to-r from-cyan-400 to-blue-500 px-6 font-semibold text-slate-950 shadow-xl shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    className="group h-12 border-white/25 bg-white/5 px-6 text-white hover:bg-white/10"
                  >
                    <PlayCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Live Demo
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-[580px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-4 shadow-2xl shadow-blue-900/30 backdrop-blur-xl"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">Operations Overview</p>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs text-emerald-300">Live Sync</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Pending Receipts', value: '128', icon: Boxes },
                    { label: 'Transfer Queue', value: '42', icon: Truck },
                    { label: 'SKU Health', value: '97.2%', icon: Activity },
                    { label: 'Fulfillment', value: '99.1%', icon: TrendingUp },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Icon className="h-4 w-4 text-cyan-300" />
                          {item.label}
                        </div>
                        <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 h-28 rounded-xl border border-white/10 bg-gradient-to-r from-cyan-400/15 via-blue-500/10 to-indigo-500/15 p-3">
                  <p className="text-xs text-slate-300">Inventory Throughput</p>
                  <div className="mt-2 flex h-14 items-end gap-2">
                    {[28, 48, 34, 56, 44, 62, 58, 70].map((h, idx) => (
                      <motion.div
                        key={`${h}-${idx}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: idx * 0.06, duration: 0.5 }}
                        className="w-full rounded-t-md bg-gradient-to-t from-cyan-400 to-blue-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -12, 0], x: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -left-8 top-10 hidden rounded-xl border border-white/15 bg-slate-900/80 p-3 shadow-xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs text-slate-200">Warehouse North</p>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">+21% efficiency</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity }}
                className="absolute -right-8 bottom-8 hidden rounded-xl border border-white/15 bg-slate-900/80 p-3 shadow-xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs text-slate-200">Stock Alert</p>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">12 SKUs low</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="product" className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 shadow-2xl shadow-slate-900/70 backdrop-blur-xl sm:p-10"
          >
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">A Unified Command Center for Inventory Teams</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                  Bring products, receipts, deliveries, and internal movements into one high-visibility workspace.
                </p>
              </div>
              <a href="#features" className="inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200">
                Explore capabilities
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-3">
                  <p className="text-sm text-slate-200">Dashboard Preview</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {['Total SKUs', 'Pending Receipts', 'Transfer Requests', 'Daily Throughput'].map((label, index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, duration: 0.4 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <p className="text-xs text-slate-300">{label}</p>
                        <p className="mt-1 text-lg font-semibold text-white">{['24,812', '128', '42', '8,904'][index]}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
                  <p className="text-sm text-slate-200">Activity Stream</p>
                  <div className="mt-3 space-y-2">
                    {['DO-1324 dispatched', 'Receipt RCP-540 verified', 'WH Transfer TR-88 approved'].map((line) => (
                      <div key={line} className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-300">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="pointer-events-none absolute -right-5 -top-5 hidden rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-xs text-cyan-100 backdrop-blur md:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Real-time update in 130 ms
              </motion.div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {productHighlights.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise-grade Features with Startup-level Speed</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Built for inventory managers and warehouse operators who need speed, reliability, and operational clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-xl shadow-slate-950/50 backdrop-blur-xl"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/15 via-transparent to-blue-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-cyan-300/35 to-blue-400/30 text-cyan-100"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="relative text-lg font-semibold">{feature.title}</h3>
                  <p className="relative mt-2 text-sm text-slate-300">{feature.description}</p>
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
                </motion.article>
              )
            })}
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Trusted by High-volume Warehouse Networks</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCounter end={500} suffix="+" label="Warehouses Managed" />
              <MetricCounter end={10} suffix="M+" label="Inventory Movements" />
              <MetricCounter end={99} suffix=".9%" label="System Uptime" />
              <MetricCounter end={30} suffix="%" label="Faster Operations" />
            </div>
          </motion.div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-500/25 px-6 py-14 text-center shadow-2xl shadow-cyan-900/25 backdrop-blur-xl sm:px-10">
            <div className="pointer-events-none absolute inset-0">
              {particles.map((particle) => (
                <motion.span
                  key={particle}
                  className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200/40"
                  style={{ left: `${(particle % 9) * 11 + 4}%`, top: `${(particle % 6) * 16 + 6}%` }}
                  animate={{ y: [0, -10, 0], opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 2.4 + (particle % 4), repeat: Infinity }}
                />
              ))}
            </div>

            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
              Transform Your Warehouse Operations Today
            </h2>
            <p className="relative mx-auto mt-3 max-w-2xl text-sm text-slate-100 sm:text-base">
              Replace scattered spreadsheets and disconnected tools with one modern inventory operating system.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button className="h-12 bg-white px-6 font-semibold text-slate-900 hover:bg-slate-100">
                    Start Free Trial
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    className="h-12 border-white/40 bg-transparent px-6 text-white hover:bg-white/10"
                  >
                    Book Demo
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="docs" className="relative z-10 border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-900/95">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-slate-950">
                  CI
                </div>
                <span className="text-lg font-semibold">CoreInventory</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Inventory infrastructure for modern logistics teams.
              </p>
              <div className="mt-4 flex gap-3 text-slate-300">
                <a href="#" className="rounded-md border border-white/10 p-2 hover:bg-white/10" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="rounded-md border border-white/10 p-2 hover:bg-white/10" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="rounded-md border border-white/10 p-2 hover:bg-white/10" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#product" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><a href="#docs" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
            Copyright 2026 CoreInventory. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
