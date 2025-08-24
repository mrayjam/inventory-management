import { motion } from 'framer-motion'

const Logo = ({ 
  size = 'medium', 
  showIcon = true, 
  className = '',
  animated = false,
  ...props 
}) => {
  const sizes = {
    small: {
      icon: 'w-6 h-6',
      iconContainer: 'w-8 h-8',
      text: 'text-base',
      gap: 'gap-2'
    },
    medium: {
      icon: 'w-6 h-6',
      iconContainer: 'w-10 h-10',
      text: 'text-lg sm:text-xl',
      gap: 'gap-3'
    },
    large: {
      icon: 'w-8 h-8',
      iconContainer: 'w-16 h-16',
      text: 'text-3xl',
      gap: 'gap-4'
    }
  }

  const currentSize = sizes[size]

  const LogoIcon = () => (
    <div className={`${currentSize.iconContainer} bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg`}>
      <svg 
        className={`${currentSize.icon} text-white`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
        />
      </svg>
    </div>
  )

  const LogoText = () => (
    <h1 className={`${currentSize.text} font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent`}>
      Inventra
    </h1>
  )

  const LogoContent = () => (
    <div className={`flex items-center ${currentSize.gap} ${className}`} {...props}>
      {showIcon && <LogoIcon />}
      <LogoText />
    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LogoContent />
      </motion.div>
    )
  }

  return <LogoContent />
}

export default Logo