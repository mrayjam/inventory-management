import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardProvider } from './contexts/DashboardContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Products = lazy(() => import('./pages/Products'))
const Suppliers = lazy(() => import('./pages/Suppliers'))
const Sales = lazy(() => import('./pages/Sales'))
const Purchase = lazy(() => import('./pages/Purchase'))
const Analytics = lazy(() => import('./pages/Analytics'))
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))
const SuperAdminPanel = lazy(() => import('./pages/SuperAdminPanel'))

const PageLoader = () => (
  <div className="min-h-[400px]">
  </div>
)

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
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
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="products" element={
                  <Suspense fallback={<PageLoader />}>
                    <Products />
                  </Suspense>
                } />
                <Route path="suppliers" element={
                  <Suspense fallback={<PageLoader />}>
                    <Suppliers />
                  </Suspense>
                } />
                <Route path="sales" element={
                  <Suspense fallback={<PageLoader />}>
                    <Sales />
                  </Suspense>
                } />
                <Route path="purchases" element={
                  <Suspense fallback={<PageLoader />}>
                    <Purchase />
                  </Suspense>
                } />
                <Route path="analytics" element={
                  <Suspense fallback={<PageLoader />}>
                    <Analytics />
                  </Suspense>
                } />
                <Route path="change-password" element={
                  <Suspense fallback={<PageLoader />}>
                    <ChangePasswordPage />
                  </Suspense>
                } />
                <Route 
                  path="super-admin" 
                  element={
                    <ProtectedRoute requireSuperAdmin={true}>
                      <Suspense fallback={<PageLoader />}>
                        <SuperAdminPanel />
                      </Suspense>
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
      </DashboardProvider>
    </AuthProvider>
  )
}

export default App
