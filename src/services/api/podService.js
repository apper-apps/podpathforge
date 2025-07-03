import mockPods from '@/services/mockData/pods.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const podService = {
  async getAll() {
    await delay(300)
    return [...mockPods]
  },

  async getById(id) {
    await delay(200)
    const pod = mockPods.find(p => p.Id === parseInt(id))
    if (!pod) throw new Error('Pod not found')
    return { ...pod }
  },

  async create(podData) {
    await delay(400)
    const newPod = {
      ...podData,
      Id: Math.max(...mockPods.map(p => p.Id)) + 1
    }
    mockPods.push(newPod)
    return { ...newPod }
  },

async update(id, podData) {
    await delay(300)
    const index = mockPods.findIndex(p => p.Id === parseInt(id))
    if (index === -1) throw new Error('Pod not found')
    
    mockPods[index] = { ...mockPods[index], ...podData }
    return { ...mockPods[index] }
  },

  async notifyMembers(podId, notification) {
    await delay(200)
    const pod = mockPods.find(p => p.Id === parseInt(podId))
    if (!pod) throw new Error('Pod not found')
    
    // In a real implementation, this would send notifications to pod members
    // For now, we'll simulate the notification process
    return {
      success: true,
      notifiedMembers: pod.memberIds.length,
      notification: {
        type: 'milestone_completed',
        message: notification.message,
        timestamp: new Date().toISOString(),
        podId: podId
      }
    }
  },

  async delete(id) {
    await delay(200)
    const index = mockPods.findIndex(p => p.Id === parseInt(id))
    if (index === -1) throw new Error('Pod not found')
    
    mockPods.splice(index, 1)
    return true
  }
}