import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { usersApi } from '../services/apiClient'

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [resetForm, setResetForm] = useState({
    adminId: '',
    newPassword: '',
  })
  const [createErrors, setCreateErrors] = useState({})
  const [resetErrors, setResetErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [admins, setAdmins] = useState([])

  const { createAdmin, resetAdminPassword, token } = useAuth()

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const adminList = await usersApi.getAdmins()
        setAdmins(adminList)
      } catch (error) {
        console.error('Failed to load admins:', error)
        const message = error.response?.data?.message || error.message || 'Failed to load admins'
        toast.error(message)
      }
    }
    
    if (token) {
      loadAdmins()
    }
  }, [token])

  const validateCreateForm = () => {
    const newErrors = {}
    
    if (!createForm.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!createForm.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(createForm.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!createForm.password) {
      newErrors.password = 'Password is required'
    } else if (createForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setCreateErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetForm = () => {
    const newErrors = {}
    
    if (!resetForm.adminId) {
      newErrors.adminId = 'Please select an admin'
    }

    if (!resetForm.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (resetForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    setResetErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (createErrors[name]) {
      setCreateErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
  }

  const handleResetChange = (e) => {
    const { name, value } = e.target
    setResetForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (resetErrors[name]) {
      setResetErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
  }


  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateCreateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Creating admin user...')

    try {
      const result = await createAdmin(createForm.name, createForm.email, createForm.password)

      if (result.success) {
        toast.success('Admin created successfully!', { id: loadingToast })
        setCreateForm({
          name: '',
          email: '',
          password: '',
        })
        
        const adminList = await usersApi.getAdmins()
        setAdmins(adminList)
      } else {
        toast.error(result.error, { id: loadingToast })
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create admin'
      toast.error(message, { id: loadingToast })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateResetForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Resetting admin password...')

    try {
      const result = await resetAdminPassword(resetForm.adminId, resetForm.newPassword)

      if (result.success) {
        toast.success(result.message || 'Password reset successfully!', { id: loadingToast })
        setResetForm({
          adminId: '',
          newPassword: '',
        })
      } else {
        toast.error(result.error, { id: loadingToast })
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password'
      toast.error(message, { id: loadingToast })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md max-[455px]:max-w-[95%]"
      >
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 sm:mb-6"
            >
              Super Admin Panel
            </motion.h2>
            
            <div className="border-b border-gray-200 mb-4 sm:mb-6">
              <nav className="-mb-px flex space-x-2 sm:space-x-8">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                    activeTab === 'create'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="max-[320px]:text-[10px]">Create Admin</span>
                </button>
                <button
                  onClick={() => setActiveTab('reset')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                    activeTab === 'reset'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="max-[320px]:text-[10px]">Reset Password</span>
                </button>
              </nav>
            </div>


            {activeTab === 'create' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleCreateSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 text-left">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className={`block w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        createErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                      }`}
                      placeholder="Enter full name"
                      value={createForm.name}
                      onChange={handleCreateChange}
                    />
                    {createErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {createErrors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 text-left">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className={`block w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        createErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                      }`}
                      placeholder="Enter email address"
                      value={createForm.email}
                      onChange={handleCreateChange}
                    />
                    {createErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {createErrors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 text-left">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      className={`block w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        createErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                      }`}
                      placeholder="Enter password"
                      value={createForm.password}
                      onChange={handleCreateChange}
                    />
                    {createErrors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {createErrors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2.5 sm:py-3 lg:py-3.5 px-3 sm:px-4 lg:px-6 border border-transparent text-xs sm:text-sm lg:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[40px] sm:min-h-[44px] lg:min-h-[48px]"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        'Create Admin'
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {activeTab === 'reset' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleResetSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label htmlFor="adminId" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 text-left">
                      Select Admin
                    </label>
                    <select
                      name="adminId"
                      id="adminId"
                      required
                      className={`block w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        resetErrors.adminId ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                      }`}
                      value={resetForm.adminId}
                      onChange={handleResetChange}
                    >
                      <option value="">Choose an admin...</option>
                      {admins.map(admin => (
                        <option key={admin.id} value={admin.id}>
                          {admin.name} ({admin.email})
                        </option>
                      ))}
                    </select>
                    {resetErrors.adminId && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {resetErrors.adminId}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 text-left">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      required
                      className={`block w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        resetErrors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                      }`}
                      placeholder="Enter new password"
                      value={resetForm.newPassword}
                      onChange={handleResetChange}
                    />
                    {resetErrors.newPassword && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {resetErrors.newPassword}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2.5 sm:py-3 lg:py-3.5 px-3 sm:px-4 lg:px-6 border border-transparent text-xs sm:text-sm lg:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[40px] sm:min-h-[44px] lg:min-h-[48px]"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <span className="max-[390px]:text-[9px]">Reset Password</span>
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full opacity-20 blur-xl"></div>
    </div>
  )
}

export default SuperAdminPanel