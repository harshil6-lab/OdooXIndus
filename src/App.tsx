import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
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
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipts"
            element={
              <ProtectedRoute>
                <Layout>
                  <Receipts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <ProtectedRoute>
                <Layout>
                  <DeliveryOrders />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <ProtectedRoute>
                <Layout>
                  <InternalTransfers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/adjustments"
            element={
              <ProtectedRoute>
                <Layout>
                  <InventoryAdjustments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Layout>
                  <MoveHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Warehouses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <CommandPalette />
      </Router>
    </ThemeProvider>
  )
}

export default App
