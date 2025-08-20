import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import Sales from './pages/Sales'
import PurchaseRegistration from './pages/PurchaseRegistration'
import Analytics from './pages/Analytics'
import ChangePasswordPage from './pages/ChangePasswordPage'
import SuperAdminPanel from './pages/SuperAdminPanel'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-20"></div>
          <div className="relative">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="sales" element={<Sales />} />
                <Route path="purchase-registration" element={<PurchaseRegistration />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
                <Route 
                  path="super-admin" 
                  element={
                    <ProtectedRoute requireSuperAdmin={true}>
                      <SuperAdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>
          </div>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              style: {
                border: '1px solid #10b981',
                color: '#065f46',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
                color: '#991b1b',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
            loading: {
              style: {
                border: '1px solid #6366f1',
                color: '#3730a3',
              },
              iconTheme: {
                primary: '#6366f1',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  )
}

export default App
