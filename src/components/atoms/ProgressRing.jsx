import { motion } from 'framer-motion'

const ProgressRing = ({ 
  progress = 0, 
  size = 'medium',
  showText = true,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: { width: 60, height: 60, strokeWidth: 4, fontSize: 'text-xs' },
    medium: { width: 80, height: 80, strokeWidth: 6, fontSize: 'text-sm' },
    large: { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-lg' }
  }
  
  const { width, height, strokeWidth, fontSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className={`relative ${className}`} {...props}>
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-semibold text-gray-700 ${fontSize}`}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressRing