import { useState, useEffect } from 'react'

export const useCountUp = (end, duration = 3000, start = 0) => {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTime
    let animationFrame

    const animation = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Smooth easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOutCubic * (end - start) + start)
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animation)
      }
    }

    if (end > 0) {
      animationFrame = requestAnimationFrame(animation)
    } else {
      setCount(0)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, start])

  return count
}