import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import UpdateCard from '@/components/molecules/UpdateCard'
import UpdateComposer from '@/components/molecules/UpdateComposer'
import PodMemberCard from '@/components/molecules/PodMemberCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { updateService } from '@/services/api/updateService'
import { reactionService } from '@/services/api/reactionService'
import { userService } from '@/services/api/userService'
import { goalService } from '@/services/api/goalService'

const PodFeed = () => {
  const [updates, setUpdates] = useState([])
  const [reactions, setReactions] = useState([])
  const [users, setUsers] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const currentUser = { Id: 1, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [updatesData, reactionsData, usersData, goalsData] = await Promise.all([
        updateService.getAll(),
        reactionService.getAll(),
        userService.getAll(),
        goalService.getAll()
      ])
      
      // Sort updates by timestamp (newest first)
      const sortedUpdates = updatesData.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      
      setUpdates(sortedUpdates)
      setReactions(reactionsData)
      setUsers(usersData)
      setGoals(goalsData)
      
    } catch (err) {
      setError('Failed to load pod feed')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePostUpdate = async (updateData) => {
    try {
      const newUpdate = await updateService.create({
        ...updateData,
        userId: currentUser.Id.toString(),
        podId: 'pod1'
      })
      
      setUpdates(prev => [newUpdate, ...prev])
    } catch (err) {
      throw new Error('Failed to post update')
    }
  }
  
  const handleReaction = async (updateId, reactionType) => {
    try {
      const existingReaction = reactions.find(r => 
        r.updateId === updateId && 
        r.userId === currentUser.Id.toString() && 
        r.type === reactionType
      )
      
      if (existingReaction) {
        // Remove reaction
        await reactionService.delete(existingReaction.Id)
        setReactions(prev => prev.filter(r => r.Id !== existingReaction.Id))
      } else {
        // Add reaction
        const newReaction = await reactionService.create({
          updateId,
          userId: currentUser.Id.toString(),
          type: reactionType,
          timestamp: new Date().toISOString()
        })
        setReactions(prev => [...prev, newReaction])
      }
    } catch (err) {
      setError('Failed to update reaction')
    }
  }
  
  const getUserById = (userId) => {
    return users.find(u => u.Id.toString() === userId.toString())
  }
  
  const getUpdateReactions = (updateId) => {
    return reactions.filter(r => r.updateId === updateId)
  }
  
  // Get pod members (excluding current user)
  const podMembers = users.filter(u => u.Id !== currentUser.Id).slice(0, 4)
  
  if (loading) return <Loading type="feed" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Pod Feed</h1>
        <p className="text-gray-600 mt-2">Stay connected with your accountability partners</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Composer */}
          <UpdateComposer user={currentUser} onPost={handlePostUpdate} />
          
          {/* Updates Feed */}
          <div className="space-y-6">
            {updates.length === 0 ? (
              <Empty
                title="No updates yet"
                description="Be the first to share your progress with your pod"
                icon="MessageCircle"
                actionLabel="Post Update"
                onAction={() => {}}
              />
            ) : (
              updates.map(update => (
                <motion.div
                  key={update.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <UpdateCard
                    update={update}
                    user={getUserById(update.userId)}
                    reactions={getUpdateReactions(update.Id)}
                    onReact={handleReaction}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pod Members */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pod Members</h3>
            {podMembers.length === 0 ? (
              <Empty
                title="No pod members"
                description="Your pod is waiting for more members to join"
                icon="Users"
              />
            ) : (
              <div className="space-y-4">
                {podMembers.map(member => (
                  <PodMemberCard
                    key={member.Id}
                    member={member}
                    goal={goals.find(g => g.userId === member.Id.toString())}
                    currentStreak={member.currentStreak}
                    online={Math.random() > 0.5}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Pod Stats */}
          <div className="bg-gradient-primary rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Pod Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Total Updates</span>
                <span className="font-semibold">{updates.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Active Members</span>
                <span className="font-semibold">{podMembers.length + 1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">This Week</span>
                <span className="font-semibold">{updates.filter(u => {
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  return new Date(u.timestamp) > weekAgo
                }).length} updates</span>
              </div>
            </div>
          </div>
          
          {/* Motivational Quote */}
          <div className="bg-gradient-secondary rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Daily Motivation</h3>
            <p className="text-white/90 italic">
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </p>
            <p className="text-white/70 text-sm mt-2">- Winston Churchill</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PodFeed