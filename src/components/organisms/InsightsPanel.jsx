import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import { milestoneService } from '@/services/api/milestoneService';
import { goalService } from '@/services/api/goalService';

const InsightsPanel = ({ goals, milestones, currentUser, podId = 'pod1' }) => {
  const [trendData, setTrendData] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [activityData, setActivityData] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadInsightsData();
  }, [goals, milestones]);

const loadInsightsData = async () => {
    try {
      setLoading(true);
      
      // Import AI assistant service
      const { aiAssistantService } = await import('@/services/api/aiAssistantService');
      
      // Get trend data for charts
      const trends = await milestoneService.getTrendData(currentUser.Id);
      setTrendData(trends);
      
      // Get completion predictions
      const predictions = await goalService.getCompletionPrediction(currentUser.Id);
      setPredictions(predictions);
      
      // Get activity patterns
      const activity = await goalService.getActivityTrends(currentUser.Id);
      setActivityData(activity);
      
      // Get AI-generated pod insights
      const aiPodInsights = await aiAssistantService.getPodMentorSummary(podId);
      setAiInsights(aiPodInsights);
      
    } catch (error) {
      console.error('Failed to load insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Progress Trend Chart Configuration
  const progressTrendOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#3B82F6', '#10B981'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    xaxis: {
      categories: trendData.map(item => item.date),
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    tooltip: {
      theme: 'light'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    }
  };

  const progressTrendSeries = [
    {
      name: 'Milestones Completed',
      data: trendData.map(item => item.completed)
    },
    {
      name: 'Goals Progress',
      data: trendData.map(item => item.progress)
    }
  ];

  // Completion Rate Chart Configuration
  const completionRateOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    labels: ['Completed', 'In Progress', 'Not Started'],
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    }
  };

  const completionRateData = [
    predictions.completedPercentage || 0,
    predictions.inProgressPercentage || 0,
    predictions.notStartedPercentage || 0
  ];

  // Activity Heatmap Configuration
  const activityHeatmapOptions = {
    chart: {
      type: 'heatmap',
      height: 200,
      toolbar: { show: false }
    },
    colors: ['#3B82F6'],
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} activities`
      }
    }
  };

  const activityHeatmapSeries = activityData.map((week, index) => ({
    name: `Week ${index + 1}`,
    data: week.map((day, dayIndex) => ({
      x: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex],
      y: day
    }))
  }));

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <span className="text-gray-600">Loading insights...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Insights & Predictions</h2>
          <p className="text-gray-600 mt-1">Analyze your progress patterns and future projections</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="TrendingUp" size={16} />
          <span>Updated daily</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progress Trends</h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Activity" size={16} className="text-primary" />
              <span className="text-sm text-gray-600">Last 30 days</span>
            </div>
          </div>
          <Chart
            options={progressTrendOptions}
            series={progressTrendSeries}
            type="line"
            height={350}
          />
        </Card>

        {/* Completion Rate Donut */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completion Overview</h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="PieChart" size={16} className="text-primary" />
              <span className="text-sm text-gray-600">All goals</span>
            </div>
          </div>
          <Chart
            options={completionRateOptions}
            series={completionRateData}
            type="donut"
            height={300}
          />
        </Card>
      </div>

      {/* Predictions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Predictions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Predictions</h3>
            <ApperIcon name="Crystal" size={16} className="text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Next milestone</span>
              <span className="text-sm font-medium text-gray-900">
                {predictions.nextMilestone || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Goal completion</span>
              <span className="text-sm font-medium text-gray-900">
                {predictions.goalCompletion || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current velocity</span>
              <span className="text-sm font-medium text-success">
                {predictions.velocity || 0} milestones/week
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Target" size={14} className="text-primary" />
                <span className="text-xs text-gray-500">
                  Based on your recent activity
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Heatmap */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activity Pattern</h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={16} className="text-primary" />
              <span className="text-sm text-gray-600">Last 4 weeks</span>
            </div>
          </div>
          <Chart
            options={activityHeatmapOptions}
            series={activityHeatmapSeries}
            type="heatmap"
            height={200}
          />
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Less activity</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-200 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-200 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
            </div>
            <span>More activity</span>
          </div>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
          <ApperIcon name="Lightbulb" size={16} className="text-primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-success/5 rounded-lg border border-success/20"
          >
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Momentum</span>
            </div>
            <p className="text-sm text-gray-600">
              You're {predictions.momentum || 'maintaining'} your pace compared to last week
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-primary/5 rounded-lg border border-primary/20"
          >
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Best Time</span>
            </div>
            <p className="text-sm text-gray-600">
              You're most productive on {predictions.bestDay || 'weekdays'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-warning/5 rounded-lg border border-warning/20"
          >
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Target" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Focus</span>
            </div>
            <p className="text-sm text-gray-600">
Consider focusing on {predictions.focusArea || 'milestone completion'}
            </p>
          </motion.div>
        </div>
      </Card>

      {/* AI Mentor Insights */}
      {aiInsights && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Mentor Insights</h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Brain" size={16} className="text-primary" />
              <span className="text-sm text-gray-600">Powered by AI</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Daily Summary */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 mb-3">
                <ApperIcon name="MessageSquare" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Pod Daily Summary</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {aiInsights.dailySummary.summary}
              </p>
              {aiInsights.dailySummary.highlightedMembers?.length > 0 && (
                <div className="mt-3 flex items-center space-x-2">
                  <ApperIcon name="Star" size={14} className="text-warning" />
                  <span className="text-xs text-gray-600">
                    Highlighted: {aiInsights.dailySummary.highlightedMembers.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Focus Theme Recommendation */}
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center space-x-2 mb-3">
                <ApperIcon name="Target" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Suggested Focus Theme</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {aiInsights.focusThemes.primaryTheme.theme}
                </h4>
                <p className="text-sm text-gray-700">
                  {aiInsights.focusThemes.primaryTheme.description}
                </p>
                <p className="text-xs text-gray-500 italic">
                  {aiInsights.focusThemes.primaryTheme.reason}
                </p>
              </div>
            </div>

            {/* Inspirational Insight */}
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center space-x-2 mb-3">
                <ApperIcon name="Lightbulb" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Inspirational Insight</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {aiInsights.inspiration.insight}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Zap" size={14} className="text-primary" />
                  <span className="text-xs font-medium text-primary">
                    Action: {aiInsights.inspiration.actionSuggestion}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  AI Confidence: {Math.round((aiInsights.inspiration.confidence || 0.8) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InsightsPanel;