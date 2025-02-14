'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackEntry {
  id: string
  content: string
  timestamp: string
  status: 'new' | 'acknowledged' | 'error' | 'ignored'
}

// Dummy feedback data
const DUMMY_FEEDBACK: FeedbackEntry[] = [
  {
    id: 'f1',
    content: 'Agent provided incorrect data format for the financial analysis',
    timestamp: '2024-02-26T10:30:00Z',
    status: 'acknowledged'
  },
  {
    id: 'f2',
    content: 'Response time was slower than usual during peak hours',
    timestamp: '2024-02-25T15:45:00Z',
    status: 'new'
  },
  {
    id: 'f3',
    content: 'API integration with Salesforce failed multiple times',
    timestamp: '2024-02-24T09:15:00Z',
    status: 'error'
  }
]

interface Props {
  agentId: string // Adding back agentId as it's needed for context
}

export default function AgentFeedback({ agentId }: Props) {
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(DUMMY_FEEDBACK)

  const handleSubmit = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)
    
    try {
      // In Designer Mode, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add new feedback to the list
      const newFeedback: FeedbackEntry = {
        id: `f${Date.now()}`,
        content: feedback,
        timestamp: new Date().toISOString(),
        status: 'new'
      }
      
      setFeedbackList([newFeedback, ...feedbackList])
      setFeedback('')
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = (feedbackId: string, newStatus: FeedbackEntry['status']) => {
    setFeedbackList(feedbackList.map(item => 
      item.id === feedbackId ? { ...item, status: newStatus } : item
    ))
  }

  const handleDelete = (feedbackId: string) => {
    setFeedbackList(feedbackList.filter(item => item.id !== feedbackId))
  }

  const getStatusColor = (status: FeedbackEntry['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-200'
      case 'acknowledged': return 'bg-green-500/20 text-green-200'
      case 'error': return 'bg-red-500/20 text-red-200'
      case 'ignored': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-white">Agent Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Feedback Input */}
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Your feedback helps improve the agent&apos;s performance. The agent will use this information as context for future operations.
          </p>
          <Textarea
            placeholder="Share your experience with this agent..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
          />
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={!feedback.trim() || isSubmitting}
              className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-medium text-gray-400">Previous Feedback</h3>
          <div className="space-y-3">
            {feedbackList.map((item) => (
              <div 
                key={item.id}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.status !== 'ignored' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(item.id, 'ignored')}
                        className="h-8 border-gray-700 text-gray-400 hover:bg-gray-800"
                      >
                        Ignore
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 border-red-900/50 text-red-400 hover:bg-red-950/50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{item.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 