import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import Receipts from '@/pages/Receipts'
import DeliveryOrders from '@/pages/DeliveryOrders'
import InternalTransfers from '@/pages/InternalTransfers'
import InventoryAdjustments from '@/pages/InventoryAdjustments'
import MoveHistory from '@/pages/MoveHistory'
import Warehouses from '@/pages/Warehouses'
import Settings from '@/pages/Settings'
import Profile from '@/pages/Profile'
import CommandPalette from '@/components/common/CommandPalette'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/landing" replace />} />

          {/* Private Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <Products />
              </Layout>
            }
          />
          <Route
            path="/receipts"
            element={
              <Layout>
                <Receipts />
              </Layout>
            }
          />
          <Route
            path="/delivery"
            element={
              <Layout>
                <DeliveryOrders />
              </Layout>
            }
          />
          <Route
            path="/transfers"
            element={
              <Layout>
                <InternalTransfers />
              </Layout>
            }
          />
          <Route
            path="/adjustments"
            element={
              <Layout>
                <InventoryAdjustments />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <MoveHistory />
              </Layout>
            }
          />
          <Route
            path="/warehouses"
            element={
              <Layout>
                <Warehouses />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Routes>
        <CommandPalette />
      </Router>
    </ThemeProvider>
  )
}

export default App
