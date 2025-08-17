import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend, rawValue }) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 shadow-blue-500/20',
    green: 'bg-green-500 text-green-600 shadow-green-500/20',
    yellow: 'bg-yellow-500 text-yellow-600 shadow-yellow-500/20',
    red: 'bg-red-500 text-red-600 shadow-red-500/20',
    purple: 'bg-purple-500 text-purple-600 shadow-purple-500/20'
  }

  const bgClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100', 
    yellow: 'bg-yellow-50 border-yellow-100',
    red: 'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100'
  }

  const numericValue = rawValue || (typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) || 0 : value)
  const animatedValue = useCountUp(numericValue, 2000)
  
  const displayValue = typeof value === 'string' && value.includes('$') 
    ? `$${(animatedValue / 1000).toFixed(0)}K`
    : typeof value === 'string' && value.includes('K')
    ? `${(animatedValue / 1000).toFixed(0)}K`
    : animatedValue.toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.03,
        y: -2,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
      transition={{ duration: 0.3, type: "spring", damping: 20 }}
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border ${bgClasses[color]} p-6 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-10 -mt-10"></div>
      
      <div className="flex items-center justify-between relative">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-slate-900"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", damping: 15 }}
          >
            {displayValue}
          </motion.p>
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`inline-flex items-center text-xs mt-2 px-2 py-1 rounded-full ${
                trend > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}
            >
              <svg className={`w-3 h-3 mr-1 ${trend > 0 ? 'rotate-0' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {Math.abs(trend)}% from last month
            </motion.div>
          )}
        </div>
        <motion.div 
          className={`p-4 rounded-2xl bg-opacity-10 shadow-lg ${colorClasses[color]}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", damping: 15 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className={`h-7 w-7 ${colorClasses[color].split(' ')[1]} drop-shadow-sm`} />
        </motion.div>
      </div>
    </motion.div>
  )
}