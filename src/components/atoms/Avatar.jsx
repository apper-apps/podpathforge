import { motion } from "framer-motion";
import React, { useState } from "react";

const sizes = {
  small: 'w-8 h-8',
  medium: 'w-10 h-10', 
  large: 'w-12 h-12',
  xlarge: 'w-16 h-16'
}

export default function Avatar({ src, alt = 'Avatar', size = 'medium', className = '' }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const classes = `
    ${sizes[size]} 
    rounded-full 
    object-cover 
    border-2 
    border-white 
    shadow-sm
    ${className}
  `.trim()

  const fallbackClasses = `
    ${sizes[size]} 
    rounded-full 
    border-2 
    border-white 
    shadow-sm
    bg-gradient-to-br from-blue-500 to-purple-600
    flex items-center justify-center
    text-white font-semibold
    ${className}
  `.trim()

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  // Extract initials from alt text for fallback
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (imageError || !src) {
    return (
      <motion.div
        className={fallbackClasses}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {getInitials(alt)}
      </motion.div>
    )
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      className={classes}
      onError={handleImageError}
      onLoad={handleImageLoad}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}