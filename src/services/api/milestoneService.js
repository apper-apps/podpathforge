import mockMilestones from '@/services/mockData/milestones.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const milestoneService = {
  async getAll() {
    await delay(300)
    return [...mockMilestones]
  },

  async getById(id) {
    await delay(200)
    const milestone = mockMilestones.find(m => m.Id === parseInt(id))
    if (!milestone) throw new Error('Milestone not found')
    return { ...milestone }
  },

  async create(milestoneData) {
    await delay(400)
    const newMilestone = {
      ...milestoneData,
      Id: Math.max(...mockMilestones.map(m => m.Id)) + 1
    }
    mockMilestones.push(newMilestone)
    return { ...newMilestone }
  },

async update(id, milestoneData) {
    await delay(300)
    const index = mockMilestones.findIndex(m => m.Id === parseInt(id))
    if (index === -1) throw new Error('Milestone not found')
    
    const previousMilestone = { ...mockMilestones[index] }
    mockMilestones[index] = { 
      ...mockMilestones[index], 
      ...milestoneData,
      lastUpdated: new Date().toISOString(),
      celebrationTriggered: !previousMilestone.completed && milestoneData.completed
    }
    
    return { ...mockMilestones[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockMilestones.findIndex(m => m.Id === parseInt(id))
    if (index === -1) throw new Error('Milestone not found')
    
    mockMilestones.splice(index, 1)
return true
  },

  async getTrendData(userId) {
    await delay(200)
    
    // Generate last 30 days of trend data
    const trendData = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Calculate milestones completed by this date
      const completedByDate = mockMilestones.filter(m => {
        const milestoneDate = new Date(m.createdAt || '2024-01-01')
        return m.completed && milestoneDate <= date
      }).length
      
      // Calculate overall progress (simple simulation)
      const progress = Math.min(100, (completedByDate / mockMilestones.length) * 100)
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        completed: completedByDate,
        progress: Math.round(progress)
      })
    }
    
    return trendData
  },

  async getCompletionStats(userId) {
    await delay(200)
    
    const userMilestones = mockMilestones.filter(m => 
      mockMilestones.some(milestone => milestone.userId === userId)
    )
    
    const completed = userMilestones.filter(m => m.completed).length
    const total = userMilestones.length
    
    return {
      completed,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageTimeToComplete: 7 // days (simulated)
    }
  }
}