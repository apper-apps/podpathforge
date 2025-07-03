import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UpdateComposer from "@/components/molecules/UpdateComposer";
import PodMemberCard from "@/components/molecules/PodMemberCard";
import UpdateCard from "@/components/molecules/UpdateCard";
import ChallengeVotingCard from "@/components/molecules/ChallengeVotingCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { updateService } from "@/services/api/updateService";
import { goalService } from "@/services/api/goalService";
import { userService } from "@/services/api/userService";
import { reactionService } from "@/services/api/reactionService";
import { challengeVotingService } from "@/services/api/challengeVotingService";
import { toast } from "react-toastify";
export default function PodFeed() {
  const [updates, setUpdates] = useState([])
  const [reactions, setReactions] = useState([])
  const [users, setUsers] = useState([])
  const [goals, setGoals] = useState([])
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
const currentUser = {
    Id: 1,
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john-doe',
    onboardingPreferences: {
      coachingStyle: 'growth-focused',
      availability: 'flexible',
      goalThemes: ['fitness', 'habit-building'],
      completedOnboarding: true
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
const loadData = async () => {
try {
      setError(null)
      
      const [updatesData, reactionsData, usersData, goalsData, challengesData] = await Promise.all([
        updateService.getAll(),
        reactionService.getAll(),
        userService.getAll(),
        goalService.getAll(),
        challengeVotingService.getAll()
      ])
      
      // Sort updates by timestamp (newest first)
      const sortedUpdates = updatesData.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      
      setUpdates(sortedUpdates)
      setReactions(reactionsData)
      setUsers(usersData)
      setGoals(goalsData)
      setChallenges(challengesData)
    } catch (err) {
      console.error('Pod feed loading error:', err)
      setError('Failed to load pod feed. Please try again.')
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
  
  const handleChallengeVote = async (challengeId, voteType) => {
    try {
      const challenge = challenges.find(c => c.Id === challengeId)
      if (!challenge) {
        toast.error('Challenge not found')
        return
      }
      
      const existingVote = challenge.votes.find(v => v.userId === currentUser.Id)
      
      if (existingVote) {
        // Update existing vote
        const updatedChallenge = await challengeVotingService.update(challengeId, {
          ...challenge,
          votes: challenge.votes.map(v => 
            v.userId === currentUser.Id 
              ? { ...v, voteType, timestamp: new Date().toISOString() }
              : v
          )
        })
        setChallenges(prev => prev.map(c => c.Id === challengeId ? updatedChallenge : c))
        toast.success('Vote updated successfully!')
      } else {
        // Add new vote
        const updatedChallenge = await challengeVotingService.update(challengeId, {
          ...challenge,
          votes: [...challenge.votes, {
            userId: currentUser.Id,
            voteType,
            timestamp: new Date().toISOString()
          }]
        })
        setChallenges(prev => prev.map(c => c.Id === challengeId ? updatedChallenge : c))
        toast.success('Vote cast successfully!')
      }
    } catch (err) {
      console.error('Voting error:', err)
      toast.error('Failed to cast vote. Please try again.')
    }
  }
  
  const getUserById = (userId) => {
    return users.find(u => u.Id.toString() === userId.toString())
  }
  
  const getUpdateReactions = (updateId) => {
    return reactions.filter(r => r.updateId === updateId)
  }
  
// Get pod members (excluding current user) with compatibility scores
  const podMembers = users
    .filter(u => u.Id !== currentUser.Id)
    .slice(0, 4)
    .map(member => ({
      ...member,
      compatibilityScore: currentUser.onboardingPreferences && member.onboardingPreferences
        ? calculateMemberCompatibility(currentUser.onboardingPreferences, member.onboardingPreferences)
        : null
    }))

  const calculateMemberCompatibility = (userPrefs, memberPrefs) => {
    if (!userPrefs || !memberPrefs) return null
    
    let score = 0
    let weight = 0

    // Coaching style match (40%)
    if (userPrefs.coachingStyle === memberPrefs.coachingStyle) {
      score += 0.4
    } else if (isCoachingCompatible(userPrefs.coachingStyle, memberPrefs.coachingStyle)) {
      score += 0.28
    }
    weight += 0.4

    // Availability match (30%)
    if (userPrefs.availability === memberPrefs.availability) {
      score += 0.3
    } else if (isAvailabilityCompatible(userPrefs.availability, memberPrefs.availability)) {
      score += 0.24
    }
    weight += 0.3

    // Goal themes overlap (30%)
    const commonGoals = userPrefs.goalThemes?.filter(theme => 
      memberPrefs.goalThemes?.includes(theme)
    ) || []
    if (commonGoals.length > 0) {
      score += 0.3 * (commonGoals.length / Math.max(userPrefs.goalThemes?.length || 1, memberPrefs.goalThemes?.length || 1))
    }
    weight += 0.3

    return weight > 0 ? score / weight : 0
  }

  const isCoachingCompatible = (style1, style2) => {
    const compatibilityMap = {
      'gentle': ['growth-focused'],
      'growth-focused': ['gentle', 'direct'],
      'direct': ['growth-focused']
    }
    return compatibilityMap[style1]?.includes(style2) || false
  }

  const isAvailabilityCompatible = (avail1, avail2) => {
    const compatibilityMap = {
      'morning': ['flexible', 'evening'],
      'evening': ['flexible', 'morning'],
      'flexible': ['morning', 'evening', 'weekend'],
      'weekend': ['flexible']
    }
    return compatibilityMap[avail1]?.includes(avail2) || false
  }
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
<div key={member.Id} className="relative">
                    <PodMemberCard
                      member={member}
                      goal={goals.find(g => g.userId === member.Id.toString())}
                      currentStreak={member.currentStreak}
                      online={Math.random() > 0.5}
                    />
                    {member.compatibilityScore !== null && (
                      <div className="absolute top-2 right-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.compatibilityScore >= 0.8 
                            ? 'bg-success/20 text-success' 
                            : member.compatibilityScore >= 0.6 
                            ? 'bg-warning/20 text-warning'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {member.compatibilityScore >= 0.8 ? 'Great Match' : 
                           member.compatibilityScore >= 0.6 ? 'Good Match' : 'Compatible'}
                        </div>
                      </div>
                    )}
                  </div>
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
          
          {/* Challenge Voting */}
          <ChallengeVotingCard 
            challenges={challenges}
            currentUser={currentUser}
            onVote={handleChallengeVote}
          />
          
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