import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import Analytics from './pages/Analytics'
import ChangePasswordPage from './pages/ChangePasswordPage'
import SuperAdminPanel from './pages/SuperAdminPanel'

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  )
}

export default App
