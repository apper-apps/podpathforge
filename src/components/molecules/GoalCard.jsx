import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ProgressRing from '@/components/atoms/ProgressRing'

const GoalCard = ({ goal, milestones = [], onGoalClick }) => {
  const completedMilestones = milestones.filter(m => m.completed).length
  const totalMilestones = milestones.length
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0
  
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'personal': return 'User'
      case 'professional': return 'Briefcase'
      case 'health': return 'Heart'
      case 'education': return 'GraduationCap'
      default: return 'Target'
    }
  }
  
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'personal': return 'primary'
      case 'professional': return 'secondary'
      case 'health': return 'success'
      case 'education': return 'accent'
      default: return 'default'
    }
  }
  
  return (
    <Card 
      hover 
      className="p-6 cursor-pointer"
      onClick={() => onGoalClick?.(goal)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <ApperIcon 
              name={getCategoryIcon(goal.category)} 
              className="w-5 h-5 text-white" 
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
            <Badge variant={getCategoryColor(goal.category)} size="small">
              {goal.category}
            </Badge>
          </div>
        </div>
        <ProgressRing progress={progress} size="small" />
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{goal.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>Due {format(new Date(goal.targetDate), 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="CheckCircle" className="w-4 h-4" />
            <span>{completedMilestones}/{totalMilestones} completed</span>
          </div>
        </div>
        
        <Badge variant={goal.status === 'active' ? 'success' : 'default'}>
          {goal.status}
        </Badge>
      </div>
    </Card>
  )
}

export default GoalCard