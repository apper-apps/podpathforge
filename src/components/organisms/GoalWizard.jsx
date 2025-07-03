import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import GoalTemplateBrowser from '@/components/organisms/GoalTemplateBrowser'
import { goalTemplateService } from '@/services/api/goalTemplateService'

const GoalWizard = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    milestones: []
  })
  
  const categories = [
    { id: 'personal', label: 'Personal', icon: 'User', color: 'primary' },
    { id: 'professional', label: 'Professional', icon: 'Briefcase', color: 'secondary' },
    { id: 'health', label: 'Health & Fitness', icon: 'Heart', color: 'success' },
    { id: 'education', label: 'Education', icon: 'GraduationCap', color: 'accent' }
  ]
  
  const generateMilestones = () => {
    // Mock AI-generated milestones
    const milestones = [
      {
        title: 'Define clear objectives',
        description: 'Break down your goal into specific, measurable objectives.',
        order: 1,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Create action plan',
        description: 'Develop a detailed step-by-step plan to achieve your objectives.',
        order: 2,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Gather necessary resources',
        description: 'Identify and collect all tools, information, and support needed.',
        order: 3,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Execute first phase',
        description: 'Begin implementing your plan with the first set of actions.',
        order: 4,
        dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Review and adjust',
        description: 'Evaluate progress and make necessary adjustments to your approach.',
        order: 5,
        dueDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    setFormData(prev => ({ ...prev, milestones }))
    setCurrentStep(3)
  }
  
  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.targetDate) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const goalData = {
      ...formData,
      id: Date.now().toString(),
      userId: 'user1',
      createdDate: new Date().toISOString(),
      status: 'active'
    }
    
onComplete(goalData)
    toast.success('Goal created successfully!')
  }

  const handleTemplateSelect = (template) => {
    const goalData = goalTemplateService.convertToGoal(template)
    setFormData(prev => ({
      ...prev,
      ...goalData
    }))
    setSelectedTemplate(template)
    setShowTemplateBrowser(false)
    setCurrentStep(2) // Skip to goal details step
  }

  const handleSkipTemplates = () => {
    setShowTemplateBrowser(false)
    setCurrentStep(2) // Go to goal details step
  }
  
const steps = [
    {
      title: 'Choose Your Starting Point',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How would you like to create your goal?</h3>
            <p className="text-gray-600">Choose from professional templates or start from scratch</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTemplateBrowser(true)}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Use a Template</h4>
                  <p className="text-sm text-gray-600 mt-1">Start with professionally crafted goal templates</p>
                </div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkipTemplates}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Plus" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Start from Scratch</h4>
                  <p className="text-sm text-gray-600 mt-1">Create a completely custom goal</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      )
    },
    {
      title: 'Goal Details',
      content: (
        <div className="space-y-6">
          {selectedTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Using template: {selectedTemplate.title}</p>
                  <p className="text-sm text-blue-600">You can customize all details below</p>
                </div>
              </div>
            </div>
          )}
          
          <Input
            label="Goal Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter your goal title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal in detail"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              rows={4}
            />
          </div>
          
          <Input
            label="Target Date"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
          />
        </div>
      )
    },
    {
      title: 'Choose Category',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Select the category that best describes your goal:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  formData.category === category.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    formData.category === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ApperIcon name={category.icon} className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{category.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: selectedTemplate ? 'Review Milestones' : 'AI-Generated Milestones',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedTemplate 
              ? 'Review and customize the milestones from your selected template:' 
              : 'Based on your goal, here are suggested milestones to help you succeed:'}
          </p>
          <div className="space-y-3">
            {formData.milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {milestone.order}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]
  
if (showTemplateBrowser) {
    return (
      <GoalTemplateBrowser
        onSelectTemplate={handleTemplateSelect}
        onCancel={onCancel}
        onSkip={handleSkipTemplates}
      />
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
            <p className="text-gray-600">Step {currentStep} of {steps.length}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  index + 1 <= currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">{steps[currentStep - 1].title}</h3>
            {steps[currentStep - 1].content}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex space-x-3">
            {currentStep < steps.length ? (
              <>
                {currentStep === 3 && !selectedTemplate && (
                  <Button
                    variant="secondary"
                    onClick={generateMilestones}
                    disabled={!formData.category}
                  >
                    Generate Milestones
                  </Button>
                )}
                {(currentStep !== 3 || selectedTemplate) && (
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                    disabled={currentStep === 2 && (!formData.title || !formData.targetDate)}
                  >
                    Next
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleSubmit}>
                Create Goal
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default GoalWizard