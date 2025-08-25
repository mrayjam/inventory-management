import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SkeletonPage } from './Skeleton'

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="animate-pulse space-y-4">
              <div className="h-16 w-16 bg-slate-200 rounded-2xl mx-auto"></div>
              <div className="h-6 bg-slate-200 rounded w-48 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute