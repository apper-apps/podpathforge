import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Card from "@/components/atoms/Card";
export default function PodMemberCard({ member, goal, currentStreak = 0, className = '' }) {
  // Ensure member object exists with fallback
  const safeMember = member || { name: 'Unknown Member', avatar: null }
  
  return (
    <Card className={`p-4 ${className}`}>
<div className="flex items-center gap-3">
        <Avatar 
          src={safeMember.avatar} 
          alt={safeMember.name}
          size="medium"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{safeMember.name}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="accent" size="small">
              {currentStreak} day streak
            </Badge>
          </div>
        </div>
      </div>
      
      {goal && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Target" className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {goal.title}
            </span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{goal.description}</p>
        </div>
      )}
    </Card>
  )
}