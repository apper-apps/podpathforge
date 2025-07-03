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
  }
}