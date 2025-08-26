import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useFormattedCountUp } from '../hooks/useCountUp'

const SmoothCountUp = memo(function SmoothCountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  delay = 0,
  className = '',
  preserveValue = true
}) {
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