import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import NavigationTabs from '@/components/molecules/NavigationTabs'
import Avatar from '@/components/atoms/Avatar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-gradient">
                  PodPath
                </h1>
                <p className="text-xs text-gray-500">Achieve Goals Together</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:block">
              <NavigationTabs />
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5" />
              </button>
              <Avatar 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="John Doe"
                size="medium"
                online={true}
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden px-4 pb-4">
          <NavigationTabs />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default Layout