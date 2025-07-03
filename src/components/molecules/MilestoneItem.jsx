import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import React from "react";
const MilestoneItem = ({ milestone, onToggleComplete }) => {
  const isOverdue = new Date(milestone.dueDate) < new Date() && !milestone.completed
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-4 p-4 rounded-lg border ${
        milestone.completed 
          ? 'bg-success/5 border-success/20' 
          : isOverdue 
            ? 'bg-error/5 border-error/20'
            : 'bg-white border-gray-200'
      }`}
    >
      <button
        onClick={() => onToggleComplete(milestone.Id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          milestone.completed
            ? 'bg-success border-success text-white'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        {milestone.completed && (
          <ApperIcon name="Check" className="w-4 h-4" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium ${
          milestone.completed ? 'text-success line-through' : 'text-gray-900'
        }`}>
          {milestone.title}
        </h4>
        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
        <div className="flex items-center space-x-4 mt-2">
          <div className={`flex items-center space-x-1 text-sm ${
            isOverdue ? 'text-error' : 'text-gray-500'
          }`}>
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>{format(new Date(milestone.dueDate), 'MMM dd, yyyy')}</span>
          </div>
          {isOverdue && (
            <Badge variant="error" size="small">
              Overdue
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${
          milestone.completed ? 'text-success' : 'text-gray-500'
        }`}>
          Step {milestone.order}
        </span>
      </div>
    </motion.div>
  )
}

export default MilestoneItem