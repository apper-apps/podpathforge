import mockTemplates from '@/services/mockData/goalTemplates.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const goalTemplateService = {
  async getAll() {
    await delay(250)
    return [...mockTemplates]
  },

  async getById(id) {
    await delay(200)
    const template = mockTemplates.find(t => t.Id === parseInt(id))
    if (!template) throw new Error('Template not found')
    return { ...template }
  },

  async create(templateData) {
    await delay(400)
    const newTemplate = {
      ...templateData,
      Id: Math.max(...mockTemplates.map(t => t.Id)) + 1
    }
    mockTemplates.push(newTemplate)
    return { ...newTemplate }
  },

  async update(id, templateData) {
    await delay(300)
    const index = mockTemplates.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error('Template not found')
    
    mockTemplates[index] = { ...mockTemplates[index], ...templateData }
    return { ...mockTemplates[index] }
  },

  async delete(id) {
    await delay(200)
    const index = mockTemplates.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error('Template not found')
    
    mockTemplates.splice(index, 1)
    return true
  },

  // Convert template to goal format
  convertToGoal(template, customizations = {}) {
    const targetDate = customizations.targetDate || 
      new Date(Date.now() + (template.estimatedDuration === '2 months' ? 60 : 
                             template.estimatedDuration === '4 months' ? 120 :
                             template.estimatedDuration === '6 months' ? 180 :
                             template.estimatedDuration === '8 months' ? 240 :
                             template.estimatedDuration === '10 months' ? 300 : 365) * 24 * 60 * 60 * 1000)

    return {
      title: customizations.title || template.title,
      description: customizations.description || template.description,
      category: template.category,
      targetDate: targetDate.toISOString().split('T')[0],
      milestones: template.milestones.map(milestone => ({
        title: milestone.title,
        description: milestone.description,
        order: milestone.order,
        dueDate: new Date(Date.now() + milestone.estimatedDays * 24 * 60 * 60 * 1000).toISOString()
      }))
    }
  }
}