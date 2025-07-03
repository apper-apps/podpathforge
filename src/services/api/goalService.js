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
  }
}