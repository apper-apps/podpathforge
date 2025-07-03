import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatsCard = ({ title, value, icon, change, trend, gradient = false }) => {
  return (
    <Card className={`p-6 ${gradient ? 'bg-gradient-primary text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 ${gradient ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-500'
            }`}>
              {trend === 'up' && <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />}
              {trend === 'down' && <ApperIcon name="TrendingDown" className="w-4 h-4 mr-1" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          gradient ? 'bg-white/20' : 'bg-gradient-primary'
        }`}>
          <ApperIcon 
            name={icon} 
            className={`w-6 h-6 ${gradient ? 'text-white' : 'text-white'}`} 
          />
        </div>
      </div>
    </Card>
  )
}

export default StatsCard