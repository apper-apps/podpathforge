import { motion } from 'framer-motion'

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'medium',
  online = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12",
    xlarge: "w-16 h-16"
  }
  
  const classes = `${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative ${className}`
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={classes}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {alt?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
      )}
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
      )}
    </motion.div>
  )
}

export default Avatar