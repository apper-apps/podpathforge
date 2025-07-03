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
  },

  async getAIInsights(podId) {
    await delay(350)
    
    const pod = mockPods.find(p => p.Id.toString() === podId.toString())
    if (!pod) {
      throw new Error('Pod not found')
    }

    // Simulate AI analysis of pod dynamics
    const memberCount = pod.memberIds.length
    const achievementRate = pod.totalAchievements || 0
    
    // Generate insights based on pod characteristics
    const insightTemplates = {
      high_performing: [
        "Your pod is demonstrating exceptional collective momentum.",
        "The synergy between pod members is creating accelerated progress.",
        "Your group's accountability dynamic is particularly effective."
      ],
      growing: [
        "Your pod is building solid foundations for long-term success.",
        "The progress patterns show steady, sustainable advancement.",
        "Your group is developing strong mutual support systems."
      ],
      developing: [
        "Your pod has excellent potential for breakthrough moments.",
        "The diverse goals in your group create rich learning opportunities.",
        "Your collective journey is just beginning to show its true potential."
      ]
    }
    
    // Determine pod performance level
    let performanceLevel = 'developing'
    if (achievementRate > 12) performanceLevel = 'high_performing'
    else if (achievementRate > 6) performanceLevel = 'growing'
    
    const templates = insightTemplates[performanceLevel]
    const selectedInsight = templates[Math.floor(Math.random() * templates.length)]
    
    // Generate personalized recommendations
    const recommendations = [
      "Consider setting a weekly pod challenge to boost engagement",
      "Try sharing weekly wins and learnings with each other",
      "Schedule brief check-in calls to maintain momentum",
      "Create shared milestones to celebrate together",
      "Rotate who leads weekly motivation themes"
    ]
    
    const personalizedMessage = recommendations[Math.floor(Math.random() * recommendations.length)]
    
    return {
      performanceLevel,
      insights: selectedInsight,
      personalizedMessage,
      recommendations: recommendations.slice(0, 3),
      podStrengths: this.analyzePodStrengths(memberCount, achievementRate),
      confidenceScore: 0.82 + Math.random() * 0.15,
      generatedAt: new Date().toISOString()
    }
  },

  analyzePodStrengths(memberCount, achievements) {
    const strengths = []
    
    if (memberCount >= 3) strengths.push("Diverse perspectives and support network")
    if (achievements > 10) strengths.push("Strong track record of goal completion")
    if (memberCount === 4) strengths.push("Optimal size for balanced accountability")
    
    // Always include at least one strength
    if (strengths.length === 0) {
      strengths.push("Commitment to mutual growth and support")
    }
    
    return strengths
  }
}