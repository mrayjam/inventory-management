import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

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
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const { createAdmin, resetAdminPassword } = useAuth()

  const mockAdmins = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]

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
    
    clearMessage()
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
    
    clearMessage()
  }

  const clearMessage = () => {
    if (message) {
      setMessage('')
      setMessageType('')
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateCreateForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const result = await createAdmin(createForm.name, createForm.email, createForm.password)

    if (result.success) {
      setMessage('Admin created successfully')
      setMessageType('success')
      setCreateForm({
        name: '',
        email: '',
        password: '',
      })
    } else {
      setMessage(result.error)
      setMessageType('error')
    }

    setIsLoading(false)
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateResetForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const result = await resetAdminPassword(resetForm.adminId, resetForm.newPassword)

    if (result.success) {
      setMessage(result.message || 'Password reset successfully')
      setMessageType('success')
      setResetForm({
        adminId: '',
        newPassword: '',
      })
    } else {
      setMessage(result.error)
      setMessageType('error')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Super Admin Panel</h2>
            
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'create'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Create Admin
                </button>
                <button
                  onClick={() => setActiveTab('reset')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reset'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reset Password
                </button>
              </nav>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mb-6 rounded-md p-4 ${
                  messageType === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <div className="text-sm">{message}</div>
              </motion.div>
            )}

            {activeTab === 'create' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className={`mt-1 block w-full px-3 py-2 border ${
                        createErrors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={createForm.name}
                      onChange={handleCreateChange}
                    />
                    {createErrors.name && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {createErrors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className={`mt-1 block w-full px-3 py-2 border ${
                        createErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={createForm.email}
                      onChange={handleCreateChange}
                    />
                    {createErrors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {createErrors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      className={`mt-1 block w-full px-3 py-2 border ${
                        createErrors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={createForm.password}
                      onChange={handleCreateChange}
                    />
                    {createErrors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {createErrors.password}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        'Create Admin'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'reset' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleResetSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">
                      Select Admin
                    </label>
                    <select
                      name="adminId"
                      id="adminId"
                      required
                      className={`mt-1 block w-full px-3 py-2 border ${
                        resetErrors.adminId ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={resetForm.adminId}
                      onChange={handleResetChange}
                    >
                      <option value="">Choose an admin...</option>
                      {mockAdmins.map(admin => (
                        <option key={admin.id} value={admin.id}>
                          {admin.name} ({admin.email})
                        </option>
                      ))}
                    </select>
                    {resetErrors.adminId && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {resetErrors.adminId}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      required
                      className={`mt-1 block w-full px-3 py-2 border ${
                        resetErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={resetForm.newPassword}
                      onChange={handleResetChange}
                    />
                    {resetErrors.newPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {resetErrors.newPassword}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SuperAdminPanel