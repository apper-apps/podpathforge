import mockReactions from '@/services/mockData/reactions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reactionService = {
  async getAll() {
    await delay(300)
    return [...mockReactions]
  },

  async getById(id) {
    await delay(200)
    const reaction = mockReactions.find(r => r.Id === parseInt(id))
    if (!reaction) throw new Error('Reaction not found')
    return { ...reaction }
  },

  async create(reactionData) {
    await delay(400)
    const newReaction = {
      ...reactionData,
      Id: Math.max(...mockReactions.map(r => r.Id)) + 1
    }
    mockReactions.push(newReaction)
    return { ...newReaction }
  },

  async update(id, reactionData) {
    await delay(300)
    const index = mockReactions.findIndex(r => r.Id === parseInt(id))
    if (index === -1) throw new Error('Reaction not found')
    
    mockReactions[index] = { ...mockReactions[index], ...reactionData }
    return { ...mockReactions[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockReactions.findIndex(r => r.Id === parseInt(id))
    if (index === -1) throw new Error('Reaction not found')
    
    mockReactions.splice(index, 1)
    return true
  }
}