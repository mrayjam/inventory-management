import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon, 
  CubeIcon, 
  BuildingStorefrontIcon,
  HomeIcon,
  KeyIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isSuperAdmin } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Suppliers', href: '/suppliers', icon: BuildingStorefrontIcon },
    { name: 'Purchase', href: '/purchase-registration', icon: ShoppingCartIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ]

  const userMenu = [
    { name: 'Change Password', href: '/change-password', icon: KeyIcon },
    ...(isSuperAdmin() ? [{ name: 'Super Admin', href: '/super-admin', icon: UserPlusIcon }] : []),
  ]

  const handleLogout = () => {
    logout()
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-32 w-80 h-80 bg-gradient-to-br from-indigo-200/25 to-blue-200/25 rounded-full blur-2xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/25 to-green-200/25 rounded-full blur-xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -80, 0],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />
        
        {/* Floating Polygons */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-lg"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-purple-300/25 to-pink-300/25 rounded-full"
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 40, -60, 0],
            scale: [1, 1.5, 0.7, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 15
          }}
        />
      </div>
      {/* Mobile header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">InventFlow</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-slate-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-slate-600" />
          )}
        </button>
      </div>

      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-white/20 flex-col relative z-10">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">InventFlow</h1>
                <p className="text-[10px] sm:text-xs text-slate-500">Management Suite</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-[10px] sm:text-xs text-slate-500">{user?.email}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
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
                    className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                    {item.name}
                  </Link>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sliding Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={closeMobileMenu}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-xl border-r border-white/30 z-50 flex flex-col"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">InventFlow</h1>
                        <p className="text-[10px] sm:text-xs text-slate-500">Management Suite</p>
                      </div>
                    </div>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <nav className="flex-1 py-4">
                  {navigation.map((item, index) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.href}
                          onClick={closeMobileMenu}
                          className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                          {item.name}
                        </Link>
                      </motion.div>
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
                          onClick={closeMobileMenu}
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
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="flex-1 min-h-screen overflow-x-hidden">
          <main className="p-3 sm:p-4 lg:p-8 min-h-full">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-white/20 min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-4rem)] max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}