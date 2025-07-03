import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const PodMemberCard = ({ member, goal, currentStreak, online = false }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3 mb-3">
        <Avatar 
          src={member.avatar} 
          alt={member.name} 
          size="medium"
          online={online}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="accent" size="small">
              {currentStreak} day streak
            </Badge>
          </div>
        </div>
      </div>
      
      {goal && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Target" className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {goal.title}
            </span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{goal.description}</p>
        </div>
      )}
    </Card>
  )
}

export default PodMemberCard