import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NavigationTabs = () => {
  const tabs = [
    { path: '/', label: 'My Progress', icon: 'BarChart3' },
    { path: '/pod-feed', label: 'Pod Feed', icon: 'Users' },
    { path: '/goals', label: 'Goals', icon: 'Target' }
  ]
  
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `relative flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-primary bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

export default NavigationTabs