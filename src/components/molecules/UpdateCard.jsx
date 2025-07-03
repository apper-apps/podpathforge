import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/atoms/ProgressRing'

const UpdateCard = ({ update, user, reactions = [], onReact }) => {
  const reactionTypes = ['👏', '🔥', '💪', '🎉', '❤️']
  
  const getReactionCount = (type) => {
    return reactions.filter(r => r.type === type).length
  }
  
  const hasUserReacted = (type) => {
    return reactions.some(r => r.type === type && r.userId === user?.Id)
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <Avatar 
          src={user?.avatar} 
          alt={user?.name} 
          size="medium"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{user?.name}</h4>
            <span className="text-sm text-gray-500">
              {format(new Date(update.timestamp), 'MMM dd, h:mm a')}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{update.content}</p>
          
          {update.imageUrl && (
            <div className="mb-4">
              <img 
                src={update.imageUrl} 
                alt="Update attachment" 
                className="rounded-lg max-w-full h-auto max-h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <ProgressRing progress={update.progress} size="small" />
              <span className="text-sm font-medium text-gray-700">
                Progress Update
              </span>
            </div>
            
            {update.milestoneId && (
              <div className="flex items-center space-x-1 text-sm text-success">
                <ApperIcon name="CheckCircle" className="w-4 h-4" />
                <span>Milestone completed!</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
            {reactionTypes.map((type) => {
              const count = getReactionCount(type)
              const hasReacted = hasUserReacted(type)
              
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onReact(update.Id, type)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                    hasReacted 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{type}</span>
                  {count > 0 && <span className="font-medium">{count}</span>}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default UpdateCard