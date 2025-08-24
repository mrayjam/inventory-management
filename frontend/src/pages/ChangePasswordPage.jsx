import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ShieldCheckIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [focusedField, setFocusedField] = useState('')
  const [countdown, setCountdown] = useState(3)

  const { changePassword, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let interval
    if (showSuccessModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (showSuccessModal && countdown === 0) {
      // Auto-close the success modal after countdown
      setShowSuccessModal(false)
      setCountdown(3) // Reset countdown for next time
    }
    return () => clearInterval(interval)
  }, [showSuccessModal, countdown])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Changing your password...')

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword)

      if (result.success) {
        toast.success(result.message || 'Password changed successfully!', { id: loadingToast })
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setShowSuccessModal(true)
        setCountdown(3)
        
        setTimeout(() => {
          setShowSuccessModal(false)
          navigate('/')
        }, 3000)
      } else {
        toast.error(result.error, { id: loadingToast })
      }
    } catch (error) {
      toast.error('An unexpected error occurred', { id: loadingToast })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <>
      <div className="min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:px-8 flex items-center justify-center overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", damping: 25 }}
          className="w-full max-w-sm sm:max-w-md max-[455px]:max-w-[95%]"
        >
        <motion.div
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/')}
            className="absolute top-3 md:top-4 right-3 md:right-4 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Close and return to dashboard"
          >
            <XMarkIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
          </button>
          
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", damping: 15 }}
              className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-3 md:mb-4"
            >
              <ShieldCheckIcon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
            >
              Change Password
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-2 text-gray-600 text-xs md:text-sm lg:text-base"
            >
              Update your password for {user?.email}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <label htmlFor="currentPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-colors duration-200 ${
                    focusedField === 'currentPassword' ? 'text-emerald-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  id="currentPassword"
                  required
                  className={`block w-full pl-7 sm:pl-8 lg:pl-10 pr-7 sm:pr-8 lg:pr-10 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                    errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('currentPassword')}
                  onBlur={() => setFocusedField('')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeSlashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.currentPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.currentPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-colors duration-200 ${
                    focusedField === 'newPassword' ? 'text-emerald-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  id="newPassword"
                  required
                  className={`block w-full pl-7 sm:pl-8 lg:pl-10 pr-7 sm:pr-8 lg:pr-10 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                    errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('newPassword')}
                  onBlur={() => setFocusedField('')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeSlashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.newPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-colors duration-200 ${
                    focusedField === 'confirmPassword' ? 'text-emerald-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  className={`block w-full pl-7 sm:pl-8 lg:pl-10 pr-7 sm:pr-8 lg:pr-10 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border rounded-lg sm:rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeSlashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 sm:py-3 lg:py-3.5 px-3 sm:px-4 lg:px-6 border border-transparent text-xs sm:text-sm lg:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[40px] sm:min-h-[44px] lg:min-h-[48px]"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Change Password'
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>

    <AnimatePresence>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:p-8 w-full max-w-md shadow-2xl border border-white/20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-green-100 rounded-full mb-3 md:mb-4"
            >
              <CheckCircleIcon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-green-600" />
            </motion.div>
            
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Password Changed Successfully!</h3>
            <p className="text-sm md:text-base text-slate-600 mb-2">Your password has been updated securely.</p>
            <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6">
              Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            
            <div className="flex gap-2 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate('/')
                }}
                className="flex-1 bg-blue-600 text-white py-1.5 md:py-2 px-3 md:px-4 text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go to Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-slate-200 text-slate-800 py-1.5 md:py-2 px-3 md:px-4 text-xs md:text-sm rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Stay Here
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  )
}

export default ChangePasswordPage