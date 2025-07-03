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
    
    mockMilestones[index] = { ...mockMilestones[index], ...milestoneData }
    return { ...mockMilestones[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockMilestones.findIndex(m => m.Id === parseInt(id))
    if (index === -1) throw new Error('Milestone not found')
    
    mockMilestones.splice(index, 1)
    return true
  }
}