import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const UpdateComposer = ({ user, onPost }) => {
  const [content, setContent] = useState('')
  const [progress, setProgress] = useState(0)
  const [isPosting, setIsPosting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    
    setIsPosting(true)
    
    try {
      await onPost({
        content: content.trim(),
        progress,
        timestamp: new Date().toISOString()
      })
      
      setContent('')
      setProgress(0)
      toast.success('Update posted successfully!')
    } catch (error) {
      toast.error('Failed to post update')
    } finally {
      setIsPosting(false)
    }
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <Avatar 
          src={user?.avatar} 
          alt={user?.name} 
          size="medium"
        />
        
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your progress with your pod..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!content.trim() || isPosting}
              className="flex items-center space-x-2"
            >
              {isPosting ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Send" className="w-4 h-4" />
                  <span>Post Update</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default UpdateComposer