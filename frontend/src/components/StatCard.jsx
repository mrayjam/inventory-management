import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
import { memo, useMemo } from 'react'

const StatCard = memo(function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  rawValue
}) {
  const colorClasses = useMemo(() => ({
    blue: 'bg-blue-500 text-gray-200 shadow-blue-500/20',
    green: 'bg-green-500 text-gray-200 shadow-green-500/20',
    yellow: 'bg-yellow-500 text-gray-200 shadow-yellow-500/20',
    red: 'bg-red-500 text-gray-200 shadow-red-500/20',
    purple: 'bg-purple-500 text-gray-200 shadow-purple-500/20',
    orange: 'bg-orange-500 text-gray-200 shadow-orange-500/20',
  }), [])

  const bgClasses = useMemo(() => ({
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100', 
    yellow: 'bg-yellow-50 border-yellow-100',
    red: 'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100'
  }), [])

  const safeValue = value ?? 0
  const safeRawValue = rawValue ?? (typeof safeValue === 'string' ? parseFloat(safeValue.replace(/[^0-9.-]/g, '')) || 0 : safeValue)
  
  const numericValue = safeRawValue ?? (typeof safeValue === 'string' ? parseFloat(safeValue.replace(/[^0-9.-]/g, '')) || 0 : safeValue)
  const animatedValue = useCountUp(numericValue, 3000)
  
  const displayValue = typeof safeValue === 'string' && safeValue.includes('$') 
    ? `${animatedValue < 0 ? '-' : ''}$${Math.abs(animatedValue) > 1000 ? (Math.abs(animatedValue) / 1000).toFixed(1) : Math.abs(animatedValue)}${Math.abs(animatedValue) > 1000 ? 'K' : ''}`
    : typeof safeValue === 'string' && safeValue.includes('K')
    ? `${animatedValue < 0 ? '-' : ''}${(Math.abs(animatedValue) / 1000).toFixed(1)}K`
    : animatedValue.toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.03,
        y: -4,
        boxShadow: `0 25px 50px rgba(0,0,0,0.15), 0 0 20px ${color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 
          color === 'green' ? 'rgba(16, 185, 129, 0.3)' : 
          color === 'yellow' ? 'rgba(245, 158, 11, 0.3)' : 
          color === 'red' ? 'rgba(239, 68, 68, 0.3)' : 
          color === 'orange' ? 'rgba(249, 115, 22, 0.3)' :
          'rgba(147, 51, 234, 0.3)'}`
      }}
      transition={{ duration: 0.3, type: "spring", damping: 20 }}
      className={`bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border-2 ${bgClasses[color]} p-3 sm:p-4 lg:p-6 relative overflow-hidden group hover:border-opacity-60 transition-all duration-300`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-10 -mt-10"></div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-pulse"></div>
      
      <div className="flex items-center justify-between relative">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">{title}</p>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 leading-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", damping: 15 }}
          >
            {displayValue}
          </motion.p>
        </div>
        <motion.div 
          className={`flex-shrink-0 p-3 md:p-4 rounded-2xl bg-opacity-10 shadow-lg ${colorClasses[color]} self-center`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className={`h-6 w-6 md:h-7 md:w-7 ${colorClasses[color].split(' ')[1]} drop-shadow-sm`} />
        </motion.div>
      </div>
    </motion.div>
  )
})

export default StatCard