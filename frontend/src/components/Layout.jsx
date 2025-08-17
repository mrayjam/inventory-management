import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  ChartBarIcon, 
  CubeIcon, 
  BuildingStorefrontIcon,
  HomeIcon,
  KeyIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const location = useLocation()
  const { user, logout, isSuperAdmin } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Suppliers', href: '/suppliers', icon: BuildingStorefrontIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ]

  const userMenu = [
    { name: 'Change Password', href: '/change-password', icon: KeyIcon },
    ...(isSuperAdmin() ? [{ name: 'Super Admin', href: '/super-admin', icon: UserPlusIcon }] : []),
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold text-slate-800">Inventory Pro</h1>
          </div>
          
          <nav className="mt-6 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              {userMenu.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}