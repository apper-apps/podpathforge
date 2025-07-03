import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import GoalCard from '@/components/molecules/GoalCard'
import GoalWizard from '@/components/organisms/GoalWizard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { goalService } from '@/services/api/goalService'
import { milestoneService } from '@/services/api/milestoneService'

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showWizard, setShowWizard] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  
  const currentUser = { Id: 1, name: 'John Doe' }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [goalsData, milestonesData] = await Promise.all([
        goalService.getAll(),
        milestoneService.getAll()
      ])
      
      // Filter user's goals
      const userGoals = goalsData.filter(goal => goal.userId === currentUser.Id.toString())
      setGoals(userGoals)
      setMilestones(milestonesData)
      
    } catch (err) {
      setError('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await goalService.create(goalData)
      setGoals(prev => [...prev, newGoal])
      
      // Create milestones for the new goal
      for (const milestone of goalData.milestones) {
        await milestoneService.create({
          ...milestone,
          goalId: newGoal.Id,
          completed: false
        })
      }
      
      setShowWizard(false)
      loadData() // Refresh to get updated milestones
    } catch (err) {
      throw new Error('Failed to create goal')
    }
  }
  
  // Filter goals based on selected filters
  const filteredGoals = goals.filter(goal => {
    const statusMatch = filterStatus === 'all' || goal.status === filterStatus
    const categoryMatch = filterCategory === 'all' || goal.category === filterCategory
    return statusMatch && categoryMatch
  })
  
  const categories = [...new Set(goals.map(goal => goal.category))]
  const statusCounts = {
    all: goals.length,
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    paused: goals.filter(g => g.status === 'paused').length
  }
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Goals</h1>
          <p className="text-gray-600 mt-2">Create and manage your personal and professional goals</p>
        </div>
        <Button onClick={() => setShowWizard(true)} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Goal</span>
        </Button>
      </div>
      
      {/* Goal Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
<motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <GoalWizard
                onComplete={handleCreateGoal}
                onCancel={() => setShowWizard(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-primary rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Goals</p>
              <p className="text-2xl font-bold">{goals.length}</p>
            </div>
            <ApperIcon name="Target" className="w-8 h-8 text-white/80" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-2xl font-bold text-success">{statusCounts.active}</p>
            </div>
            <ApperIcon name="Play" className="w-8 h-8 text-success" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-primary">{statusCounts.completed}</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-accent">
                {goals.length > 0 ? Math.round((statusCounts.completed / goals.length) * 100) : 0}%
              </p>
            </div>
            <ApperIcon name="TrendingUp" className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        
        {categories.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Goals Grid */}
      <div className="space-y-6">
        {filteredGoals.length === 0 ? (
          <Empty
            title={goals.length === 0 ? "No goals yet" : "No goals match your filters"}
            description={goals.length === 0 ? "Create your first goal to start your journey" : "Try adjusting your filters or create a new goal"}
            icon="Target"
            actionLabel="Create Goal"
            onAction={() => setShowWizard(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGoals.map(goal => (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GoalCard
                  goal={goal}
                  milestones={milestones.filter(m => m.goalId === goal.Id)}
                  onGoalClick={() => {}}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Goals