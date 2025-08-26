import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useFormattedCountUp } from '../hooks/useCountUp'

/**
 * Example component demonstrating smooth count-up animations
 * This shows how to implement count-up without loading flickers
 */
const SmoothCountUp = memo(function SmoothCountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  delay = 0,
  className = '',
  preserveValue = true
}) {
  // Parse numeric value from any format
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.-]/g, '')) || 0 
    : value || 0

  const { displayValue, isAnimating } = useFormattedCountUp(
    numericValue,
    duration,
    {
      prefix,
      suffix,
      delay,
      preserveValue,
      decimals: numericValue >= 1000 ? 1 : 0
    }
  )

  return (
    <motion.span
      className={`font-bold ${className}`}
      initial={{ opacity: 0.7 }}
      animate={{ 
        opacity: 1,
        scale: isAnimating ? [1, 1.02, 1] : 1
      }}
      transition={{ 
        duration: isAnimating ? 0.3 : 0.15,
        ease: "easeOut"
      }}
    >
      {displayValue}
    </motion.span>
  )
})

export default SmoothCountUp

/**
 * Usage Examples:
 * 
 * // Basic usage
 * <SmoothCountUp value={1250} prefix="$" />
 * 
 * // With custom delay and formatting
 * <SmoothCountUp 
 *   value={45678} 
 *   prefix="$" 
 *   suffix="K" 
 *   delay={200}
 *   duration={2000}
 * />
 * 
 * // Preserve value during load
 * <SmoothCountUp 
 *   value={stats.totalRevenue} 
 *   prefix="$" 
 *   preserveValue={true}
 *   className="text-2xl text-green-600"
 * />
 */