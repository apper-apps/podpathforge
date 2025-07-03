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
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1
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
  }
}