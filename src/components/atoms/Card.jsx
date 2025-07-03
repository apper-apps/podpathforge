import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = false,
  gradient = false,
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl border border-gray-200 shadow-sm"
  const hoverClasses = hover ? "hover:shadow-md hover:scale-[1.02]" : ""
  const gradientClasses = gradient ? "bg-gradient-surface" : ""
  
  const classes = `${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={classes}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card