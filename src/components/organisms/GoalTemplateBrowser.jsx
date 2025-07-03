import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { goalTemplateService } from '@/services/api/goalTemplateService'

const GoalTemplateBrowser = ({ onSelectTemplate, onCancel, onSkip }) => {
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const categories = [
    { id: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { id: 'health', label: 'Health & Fitness', icon: 'Heart' },
    { id: 'professional', label: 'Professional', icon: 'Briefcase' },
    { id: 'personal', label: 'Personal', icon: 'User' },
    { id: 'education', label: 'Education', icon: 'GraduationCap' }
  ]

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchTerm, selectedCategory, selectedDifficulty])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError('')
      const templatesData = await goalTemplateService.getAll()
      setTemplates(templatesData)
    } catch (err) {
      setError('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty)
    }

    // Search filter
    if (searchTerm) {
      const fuse = new Fuse(filtered, {
        keys: ['title', 'description', 'tags'],
        threshold: 0.3
      })
      const results = fuse.search(searchTerm)
      filtered = results.map(result => result.item)
    }

    setFilteredTemplates(filtered)
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleUseTemplate = () => {
    onSelectTemplate(selectedTemplate)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'danger'
      default: return 'primary'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'health': return 'Heart'
      case 'professional': return 'Briefcase'
      case 'personal': return 'User'
      case 'education': return 'GraduationCap'
      default: return 'Target'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTemplates} />

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Goal Templates</h2>
            <p className="text-gray-600">Choose from professionally crafted goal templates</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onSkip}>
              Skip Templates
            </Button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name={getCategoryIcon(template.category)} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{template.title}</h3>
                    <p className="text-xs text-gray-500">{template.estimatedDuration}</p>
                  </div>
                </div>
                <Badge variant={getDifficultyColor(template.difficulty)} size="sm">
                  {template.difficulty}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{template.milestones.length} milestones</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{template.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getCategoryIcon(selectedTemplate.category)} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedTemplate.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getDifficultyColor(selectedTemplate.difficulty)} size="sm">
                          {selectedTemplate.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-500">{selectedTemplate.estimatedDuration}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Milestones ({selectedTemplate.milestones.length})</h4>
                  <div className="space-y-3">
                    {selectedTemplate.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {milestone.order}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          <span className="text-xs text-gray-500">~{milestone.estimatedDays} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button variant="ghost" onClick={() => setShowPreview(false)}>
                    Back to Templates
                  </Button>
                  <Button onClick={handleUseTemplate} className="flex items-center space-x-2">
                    <ApperIcon name="Play" className="w-4 h-4" />
                    <span>Use This Template</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GoalTemplateBrowser