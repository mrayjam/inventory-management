import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  ChartBarIcon, 
  CubeIcon, 
  BuildingStorefrontIcon,
  HomeIcon 
} from '@heroicons/react/24/outline'

export default function Layout() {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Suppliers', href: '/suppliers', icon: BuildingStorefrontIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-bold text-slate-800">Inventory Pro</h1>
          </div>
          <nav className="mt-6">
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