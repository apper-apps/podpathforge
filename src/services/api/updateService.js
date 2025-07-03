import mockUpdates from '@/services/mockData/updates.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const updateService = {
  async getAll() {
    await delay(300)
    return [...mockUpdates]
  },

  async getById(id) {
    await delay(200)
    const update = mockUpdates.find(u => u.Id === parseInt(id))
    if (!update) throw new Error('Update not found')
    return { ...update }
  },

  async create(updateData) {
    await delay(400)
    const newUpdate = {
      ...updateData,
      Id: Math.max(...mockUpdates.map(u => u.Id)) + 1
    }
    mockUpdates.push(newUpdate)
    return { ...newUpdate }
  },

  async update(id, updateData) {
    await delay(300)
    const index = mockUpdates.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('Update not found')
    
    mockUpdates[index] = { ...mockUpdates[index], ...updateData }
    return { ...mockUpdates[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockUpdates.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('Update not found')
    
mockUpdates.splice(index, 1)
    return true
  },

  async getPodSummary(podId) {
    await delay(300)
    const podUpdates = mockUpdates.filter(u => u.podId === podId)
    
    // Get today's updates
    const today = new Date()
    const todayUpdates = podUpdates.filter(update => {
      const updateDate = new Date(update.timestamp)
      return updateDate.toDateString() === today.toDateString()
    })
    
    // Identify top performers (most progress today)
    const topPerformers = todayUpdates
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 2)
      .map(update => `User ${update.userId}`)
    
    // Extract key achievements from update content
    const achievements = todayUpdates
      .filter(update => update.content.toLowerCase().includes('completed') || update.content.toLowerCase().includes('finished'))
      .map(update => update.content.substring(0, 50) + '...')
      .slice(0, 3)
    
    return {
      updates: todayUpdates,
      topPerformers,
      achievements,
      totalProgress: todayUpdates.reduce((sum, u) => sum + (u.progress || 0), 0),
      timestamp: new Date().toISOString()
    }
  }
}