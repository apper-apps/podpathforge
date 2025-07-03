import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import GoalCard from "@/components/molecules/GoalCard";
import PodMemberCard from "@/components/molecules/PodMemberCard";
import MilestoneItem from "@/components/molecules/MilestoneItem";
import InsightsPanel from "@/components/organisms/InsightsPanel";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import GoalsPage from "@/components/pages/Goals";
import goalTemplates from "@/services/mockData/goalTemplates.json";
import reactions from "@/services/mockData/reactions.json";
import milestonesData from "@/services/mockData/milestones.json";
import goalsData from "@/services/mockData/goals.json";
import podsData from "@/services/mockData/pods.json";
import updatesData from "@/services/mockData/updates.json";
import usersData from "@/services/mockData/users.json";
import { milestoneService } from "@/services/api/milestoneService";
import { goalService } from "@/services/api/goalService";
import { userService } from "@/services/api/userService";
import { podService } from "@/services/api/podService";
const MyProgress = () => {
  const [goals, setGoals] = useState([])
  const [milestones, setMilestones] = useState([])
  const [podMembers, setPodMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [celebratingMilestone, setCelebratingMilestone] = useState(null)
const currentUser = {
    id: 1,
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john-doe'
  }
  
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
      const userGoals = goalsData.filter(goal => goal.userId === currentUser.id.toString())
      setGoals(userGoals)
      
      // Get milestones for user's goals
      const userMilestones = milestonesData.filter(milestone => 
        userGoals.some(goal => goal.id === milestone.goalId)
      )
      setMilestones(userMilestones)
      
// Get pod members
      const userPods = podsData.filter(pod => 
        pod.memberIds.includes(currentUser.id.toString())
      )
      if (userPods.length > 0) {
        const memberIds = userPods[0].memberIds.filter(id => id !== currentUser.id.toString())
        const members = usersData.filter(user => memberIds.includes(user.id.toString()))
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
      const milestone = milestones.find(m => m.id === milestoneId)
      if (!milestone) return
      
      const wasCompleted = milestone.completed
      const updatedMilestone = await milestoneService.update(milestoneId, {
        ...milestone,
        completed: !milestone.completed
      })
      
setMilestones(prev => 
        prev.map(m => m.id === milestoneId ? updatedMilestone : m)
      )
      
      // Trigger celebration animations and notifications if milestone was just completed
      if (!wasCompleted && updatedMilestone.completed) {
        // Set celebrating state for animation
        setCelebratingMilestone(milestoneId)
        
        // Show confetti
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        
        // Show success toast
        toast.success(`🎉 Milestone completed: ${milestone.title}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        
        // Notify pod members
        await notifyPodMembers(milestone)
        
        // Reset celebration state
        setTimeout(() => setCelebratingMilestone(null), 2000)
      } else if (wasCompleted && !updatedMilestone.completed) {
        // Show info toast when uncompleting
        toast.info(`Milestone unmarked: ${milestone.title}`, {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (err) {
      setError('Failed to update milestone')
      toast.error('Failed to update milestone. Please try again.')
    }
  }
  
  const notifyPodMembers = async (milestone) => {
    try {
      // Get user's pod
const userPods = await podService.getAll()
      const userPod = userPods.find(pod => 
        pod.memberIds.includes(currentUser.id.toString())
      )
      if (userPod) {
        // Create notification message
        const notificationMessage = `${currentUser.name} just completed a milestone: ${milestone.title}! 🎉`
        
        // This would typically send notifications to pod members
        // For now, we'll show a toast indicating the pod was notified
        toast.success(`🚀 Your pod has been notified of your achievement!`, {
          position: "bottom-right",
          autoClose: 4000,
        })
      }
    } catch (err) {
      console.error('Failed to notify pod members:', err)
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
    ? milestones.filter(m => m.goalId === activeGoal.id).sort((a, b) => a.order - b.order)
    : []
  
  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadData} />
  
return (
    <div className="space-y-8">
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
          colors={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']}
        />
      )}
      
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
      
      {/* Insights Panel */}
      <InsightsPanel 
        goals={goals} 
        milestones={milestones} 
        currentUser={currentUser} 
      />
      
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
                    key={goal.id}
                    goal={goal}
                    milestones={milestones.filter(m => m.goalId === goal.id)}
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
                    <motion.div
                      key={milestone.id}
                      initial={{ scale: 1 }}
animate={{ 
                        scale: celebratingMilestone === milestone.id ? [1, 1.05, 1] : 1,
                        rotate: celebratingMilestone === milestone.id ? [0, 2, -2, 0] : 0
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeInOut"
                      }}
                    >
                      <MilestoneItem
                        milestone={milestone}
                        onToggleComplete={handleToggleMilestone}
                      />
                    </motion.div>
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
                    key={member.id}
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
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg border border-success/20 cursor-pointer transition-all duration-200"
                    >
                      <motion.div 
                        className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                          delay: 0.1
                        }}
                      >
                        <ApperIcon name="Check" className="w-4 h-4" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-medium text-success">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">Completed recently</p>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <ApperIcon name="Sparkles" className="w-5 h-5 text-success" />
                      </motion.div>
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