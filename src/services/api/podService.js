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
},

  async findCompatiblePods(userId, userPreferences) {
    await delay(400)
    const allPods = [...mockPods]
    
    const podsWithScores = await Promise.all(
      allPods.map(async pod => {
        const compatibilityScore = await this.calculatePodCompatibility(userId, pod, userPreferences)
        return {
          ...pod,
          compatibilityScore
        }
      })
    )

    return podsWithScores
      .filter(pod => pod.compatibilityScore > 0.5)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  },

  async calculatePodCompatibility(userId, pod, userPreferences) {
    if (!pod.memberIds || pod.memberIds.length === 0) return 0.8 // New pods get good score

    // Import userService to access user data
    const { userService } = await import('./userService.js')
    
    try {
      const memberCompatibilities = await Promise.all(
        pod.memberIds.map(async memberId => {
          const member = await userService.getById(memberId)
          return userService.calculateCompatibility(userPreferences, member.onboardingPreferences)
        })
      )

      const avgCompatibility = memberCompatibilities.reduce((sum, score) => sum + score, 0) / memberCompatibilities.length
      
      // Bonus for pods with 2-4 members (ideal size)
      const sizeBonus = pod.memberIds.length >= 2 && pod.memberIds.length <= 4 ? 0.1 : 0
      
      return Math.min(avgCompatibility + sizeBonus, 1.0)
    } catch (error) {
      console.error('Error calculating pod compatibility:', error)
      return 0.5 // Default compatibility score
    }
  },

  async recommendPods(userId, userPreferences) {
    await delay(300)
    const compatiblePods = await this.findCompatiblePods(userId, userPreferences)
    
    return compatiblePods.slice(0, 5).map(pod => ({
      ...pod,
      recommendationReason: this.generateRecommendationReason(pod.compatibilityScore)
    }))
  },

  generateRecommendationReason(score) {
    if (score >= 0.9) return "Excellent match based on your preferences"
    if (score >= 0.8) return "Strong compatibility with pod members"
    if (score >= 0.7) return "Good alignment with your goals and style"
    if (score >= 0.6) return "Potential good fit with some shared interests"
    return "Compatible group with room to grow together"
  }
}