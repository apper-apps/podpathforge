import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-error focus:border-error focus:ring-error/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input