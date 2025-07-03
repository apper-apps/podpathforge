import mockGoals from '@/services/mockData/goals.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const goalService = {
  async getAll() {
    await delay(300)
    return [...mockGoals]
  },

  async getById(id) {
    await delay(200)
    const goal = mockGoals.find(g => g.Id === parseInt(id))
    if (!goal) throw new Error('Goal not found')
    return { ...goal }
  },

  async create(goalData) {
    await delay(400)
    const newGoal = {
      ...goalData,
      Id: Math.max(...mockGoals.map(g => g.Id)) + 1
    }
    mockGoals.push(newGoal)
    return { ...newGoal }
  },

  async update(id, goalData) {
    await delay(300)
    const index = mockGoals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) throw new Error('Goal not found')
    
    mockGoals[index] = { ...mockGoals[index], ...goalData }
    return { ...mockGoals[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockGoals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) throw new Error('Goal not found')
    
    mockGoals.splice(index, 1)
return true
  },

  async getCompletionPrediction(userId) {
    await delay(300)
    
    const userGoals = mockGoals.filter(g => g.userId === userId)
    const completedGoals = userGoals.filter(g => g.status === 'completed')
    const activeGoals = userGoals.filter(g => g.status === 'active')
    
    // Calculate completion percentages
    const total = userGoals.length
    const completed = completedGoals.length
    const inProgress = activeGoals.length
    const notStarted = total - completed - inProgress
    
    // Calculate velocity (milestones per week)
    const velocity = Math.round(Math.random() * 3) + 1
    
    // Predict next milestone (simulate based on velocity)
    const daysToNext = Math.ceil(7 / velocity)
    const nextMilestone = new Date()
    nextMilestone.setDate(nextMilestone.getDate() + daysToNext)
    
    // Predict goal completion
    const remainingMilestones = Math.round(Math.random() * 10) + 5
    const weeksToCompletion = Math.ceil(remainingMilestones / velocity)
    const goalCompletion = new Date()
    goalCompletion.setDate(goalCompletion.getDate() + (weeksToCompletion * 7))
    
    return {
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      inProgressPercentage: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      notStartedPercentage: total > 0 ? Math.round((notStarted / total) * 100) : 0,
      velocity,
      nextMilestone: nextMilestone.toLocaleDateString(),
      goalCompletion: goalCompletion.toLocaleDateString(),
      momentum: Math.random() > 0.5 ? 'accelerating' : 'maintaining',
      bestDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)],
      focusArea: ['milestone completion', 'goal setting', 'consistency'][Math.floor(Math.random() * 3)]
    }
  },

  async getActivityTrends(userId) {
    await delay(200)
    
    // Generate 4 weeks of activity data (7 days each)
    const activityData = []
    
    for (let week = 0; week < 4; week++) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        // Simulate activity levels (0-5)
        const activity = Math.floor(Math.random() * 6)
        weekData.push(activity)
      }
      activityData.push(weekData)
    }
    
    return activityData
  }
}