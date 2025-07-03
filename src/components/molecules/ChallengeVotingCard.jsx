import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

export default function ChallengeVotingCard({ challenges, currentUser, onVote }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Get current week's active challenge
  const activeChallenge = challenges.find(c => c.status === 'active');
  
  if (!activeChallenge) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <ApperIcon name="Trophy" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Challenge</h3>
          <p className="text-gray-600 text-sm">
            Weekly challenges will appear here for pod voting
          </p>
        </div>
      </Card>
    );
  }

  const totalVotes = activeChallenge.votes.length;
  const userVote = activeChallenge.votes.find(v => v.userId === currentUser.Id);
  
  // Calculate vote percentages for each option
  const voteResults = activeChallenge.options.map(option => {
    const optionVotes = activeChallenge.votes.filter(v => v.voteType === option.type);
    const percentage = totalVotes > 0 ? (optionVotes.length / totalVotes) * 100 : 0;
    return {
      ...option,
      votes: optionVotes.length,
      percentage: Math.round(percentage)
    };
  });

  const handleVote = (voteType) => {
    onVote(activeChallenge.Id, voteType);
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Trophy" size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Challenge</h3>
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={toggleResults}
          className="text-xs"
        >
          {showResults ? 'Hide Results' : 'View Results'}
        </Button>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">{activeChallenge.title}</h4>
        <p className="text-gray-600 text-sm mb-4">{activeChallenge.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Ends {new Date(activeChallenge.endDate).toLocaleDateString()}</span>
          <span>{totalVotes} votes</span>
        </div>
      </div>

      {!showResults ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {userVote ? 'You voted for:' : 'Choose your focus area:'}
          </p>
          
          {voteResults.map((option, index) => {
            const isSelected = userVote?.voteType === option.type;
            const hasVoted = Boolean(userVote);
            
            return (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isSelected ? "primary" : "outline"}
                  size="medium"
                  onClick={() => handleVote(option.type)}
                  disabled={false}
                  className={`w-full justify-start text-left ${
                    isSelected 
                      ? 'bg-primary-600 text-white' 
                      : 'hover:bg-gray-50 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon 
                      name={option.icon} 
                      size={16} 
                      className={isSelected ? 'text-white' : 'text-gray-600'} 
                    />
                    <div>
                      <div className="font-medium">{option.title}</div>
                      <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <ApperIcon name="Check" size={16} className="text-white ml-auto" />
                  )}
                </Button>
              </motion.div>
            );
          })}
          
          {userVote && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Your vote has been recorded!
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                You can change your vote anytime before the challenge ends.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Current Results</h4>
            <span className="text-sm text-gray-500">{totalVotes} total votes</span>
          </div>
          
          {voteResults.map((option, index) => (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name={option.icon} size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{option.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{option.votes} votes</span>
                  <span className="text-sm font-semibold text-gray-900">{option.percentage}%</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${option.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  />
                </div>
                {userVote?.voteType === option.type && (
                  <div className="absolute -top-1 -right-1">
                    <ApperIcon name="User" size={12} className="text-primary-600" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {totalVotes === 0 && (
            <div className="text-center py-4">
              <ApperIcon name="Vote" size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">No votes yet. Be the first to vote!</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}