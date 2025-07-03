import mockUsers from '@/services/mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  async getAll() {
    await delay(300)
    return [...mockUsers]
  },

  async getById(id) {
    await delay(200)
    const user = mockUsers.find(u => u.Id === parseInt(id))
    if (!user) throw new Error('User not found')
    return { ...user }
  },

async create(userData) {
    await delay(400)
    const newUser = {
      ...userData,
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      onboardingPreferences: {
        coachingStyle: userData.coachingStyle || 'growth-focused',
        availability: userData.availability || 'flexible',
        goalThemes: userData.goalThemes || ['habit-building'],
        completedOnboarding: false
      }
    }
    mockUsers.push(newUser)
    return { ...newUser }
  },

  async update(id, userData) {
    await delay(300)
    const index = mockUsers.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    
    mockUsers[index] = { ...mockUsers[index], ...userData }
    return { ...mockUsers[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockUsers.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    
    mockUsers.splice(index, 1)
    return true
},

  async updateOnboardingPreferences(id, preferences) {
    await delay(300)
    const index = mockUsers.findIndex(u => u.Id === parseInt(id))
    if (index === -1) throw new Error('User not found')
    
    mockUsers[index].onboardingPreferences = {
      ...mockUsers[index].onboardingPreferences,
      ...preferences,
      completedOnboarding: true
    }
    return { ...mockUsers[index] }
  },

  async findCompatibleUsers(userId, preferences) {
    await delay(400)
    const currentUser = mockUsers.find(u => u.Id === parseInt(userId))
    if (!currentUser) throw new Error('User not found')

    const compatibleUsers = mockUsers
      .filter(u => u.Id !== parseInt(userId))
      .map(user => ({
        ...user,
        compatibilityScore: this.calculateCompatibility(preferences, user.onboardingPreferences)
      }))
      .filter(user => user.compatibilityScore > 0.6)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    return compatibleUsers
  },

  calculateCompatibility(userPrefs, otherPrefs) {
    if (!userPrefs || !otherPrefs) return 0

    let score = 0
    let totalWeight = 0

    // Coaching style compatibility (40% weight)
    const coachingWeight = 0.4
    if (userPrefs.coachingStyle === otherPrefs.coachingStyle) {
      score += coachingWeight
    } else if (this.isCoachingStyleCompatible(userPrefs.coachingStyle, otherPrefs.coachingStyle)) {
      score += coachingWeight * 0.7
    }
    totalWeight += coachingWeight

    // Availability compatibility (30% weight)
    const availabilityWeight = 0.3
    if (userPrefs.availability === otherPrefs.availability) {
      score += availabilityWeight
    } else if (this.isAvailabilityCompatible(userPrefs.availability, otherPrefs.availability)) {
      score += availabilityWeight * 0.8
    }
    totalWeight += availabilityWeight

    // Goal themes overlap (30% weight)
    const goalWeight = 0.3
    const commonGoals = userPrefs.goalThemes?.filter(theme => 
      otherPrefs.goalThemes?.includes(theme)
    ) || []
    if (commonGoals.length > 0) {
      score += goalWeight * (commonGoals.length / Math.max(userPrefs.goalThemes?.length || 1, otherPrefs.goalThemes?.length || 1))
    }
    totalWeight += goalWeight

    return totalWeight > 0 ? score / totalWeight : 0
  },

  isCoachingStyleCompatible(style1, style2) {
    const compatibilityMap = {
      'gentle': ['growth-focused'],
      'growth-focused': ['gentle', 'direct'],
      'direct': ['growth-focused']
    }
    return compatibilityMap[style1]?.includes(style2) || false
  },

  isAvailabilityCompatible(avail1, avail2) {
    const compatibilityMap = {
      'morning': ['flexible', 'evening'],
      'evening': ['flexible', 'morning'],
      'flexible': ['morning', 'evening', 'weekend'],
      'weekend': ['flexible']
    }
    return compatibilityMap[avail1]?.includes(avail2) || false
  }
}