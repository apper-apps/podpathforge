import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StatsCard from '@/components/molecules/StatsCard'
import GoalCard from '@/components/molecules/GoalCard'
import MilestoneItem from '@/components/molecules/MilestoneItem'
import PodMemberCard from '@/components/molecules/PodMemberCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { goalService } from '@/services/api/goalService'
import { milestoneService } from '@/services/api/milestoneService'
import { podService } from '@/services/api/podService'
import { userService } from '@/services/api/userService'

const MyProgress = () => {
  const [goals, setGoals] = useState([])
  const [milestones, setMilestones] = useState([])
  const [podMembers, setPodMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const currentUser = { Id: 1, name: 'John Doe' }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [goalsData, milestonesData, podsData, usersData] = await Promise.all([
        goalService.getAll(),
        milestoneService.getAll(),
        podService.getAll(),
        userService.getAll()
      ])
      
      // Filter user's goals
      const userGoals = goalsData.filter(goal => goal.userId === currentUser.Id.toString())
      setGoals(userGoals)
      
      // Get milestones for user's goals
      const userMilestones = milestonesData.filter(milestone => 
        userGoals.some(goal => goal.Id === milestone.goalId)
      )
      setMilestones(userMilestones)
      
      // Get pod members
      const userPods = podsData.filter(pod => 
        pod.memberIds.includes(currentUser.Id.toString())
      )
      if (userPods.length > 0) {
        const memberIds = userPods[0].memberIds.filter(id => id !== currentUser.Id.toString())
        const members = usersData.filter(user => memberIds.includes(user.Id.toString()))
        setPodMembers(members)
      }
      
    } catch (err) {
      setError('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleToggleMilestone = async (milestoneId) => {
    try {
      const milestone = milestones.find(m => m.Id === milestoneId)
      if (!milestone) return
      
      const updatedMilestone = await milestoneService.update(milestoneId, {
        ...milestone,
        completed: !milestone.completed
      })
      
      setMilestones(prev => 
        prev.map(m => m.Id === milestoneId ? updatedMilestone : m)
      )
    } catch (err) {
      setError('Failed to update milestone')
    }
  }
  
  // Calculate stats
  const activeGoals = goals.filter(goal => goal.status === 'active').length
  const completedMilestones = milestones.filter(m => m.completed).length
  const totalMilestones = milestones.length
  const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  
  // Get active goal and its milestones
  const activeGoal = goals.find(goal => goal.status === 'active')
  const activeGoalMilestones = activeGoal 
    ? milestones.filter(m => m.goalId === activeGoal.Id).sort((a, b) => a.order - b.order)
    : []
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">My Progress</h1>
        <p className="text-gray-600 mt-2">Track your goals and celebrate your achievements</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Goals"
          value={activeGoals}
          icon="Target"
          gradient={true}
        />
        <StatsCard
          title="Completed Milestones"
          value={completedMilestones}
          icon="CheckCircle"
          change="+12 this week"
          trend="up"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon="TrendingUp"
          change="+5% from last week"
          trend="up"
        />
        <StatsCard
          title="Current Streak"
          value="7 days"
          icon="Flame"
          change="Personal best!"
          trend="up"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Goals */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Goals</h2>
            {goals.length === 0 ? (
              <Empty
                title="No goals yet"
                description="Create your first goal to start your journey"
                icon="Target"
                actionLabel="Create Goal"
                onAction={() => {}}
              />
            ) : (
              <div className="space-y-4">
                {goals.map(goal => (
                  <GoalCard
                    key={goal.Id}
                    goal={goal}
                    milestones={milestones.filter(m => m.goalId === goal.Id)}
                    onGoalClick={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Current Milestone Progress */}
          {activeGoal && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Current Milestones - {activeGoal.title}
              </h2>
              {activeGoalMilestones.length === 0 ? (
                <Empty
                  title="No milestones"
                  description="Milestones will appear here once generated"
                  icon="CheckCircle"
                />
              ) : (
                <div className="space-y-4">
                  {activeGoalMilestones.map(milestone => (
                    <MilestoneItem
                      key={milestone.Id}
                      milestone={milestone}
                      onToggleComplete={handleToggleMilestone}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pod Members */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Pod</h3>
            {podMembers.length === 0 ? (
              <Empty
                title="No pod members"
                description="Join a pod to connect with like-minded achievers"
                icon="Users"
                actionLabel="Find Pod"
                onAction={() => {}}
              />
            ) : (
              <div className="space-y-4">
                {podMembers.map(member => (
                  <PodMemberCard
                    key={member.Id}
                    member={member}
                    goal={goals[0]}
                    currentStreak={member.currentStreak}
                    online={Math.random() > 0.5}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {completedMilestones > 0 ? (
                milestones
                  .filter(m => m.completed)
                  .slice(0, 3)
                  .map(milestone => (
                    <motion.div
                      key={milestone.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg border border-success/20"
                    >
                      <div className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center">
                        <ApperIcon name="Check" className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-success">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">Completed recently</p>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <Empty
                  title="No achievements yet"
                  description="Complete milestones to see your achievements here"
                  icon="Trophy"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProgress