'use client'

import { useState, useEffect } from 'react'
import { AgentLog } from '@/types/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAgentLogs } from '@/lib/api/agents'

// Dummy log data for demonstration
const DUMMY_LOGS: AgentLog[] = [
  {
    agentId: '1',
    timestamp: '2024-02-26T15:30:00Z',
    level: 'info',
    message: 'Agent started successfully',
    metadata: { config: { model: 'gpt-4' } }
  },
  {
    agentId: '1',
    timestamp: '2024-02-26T15:30:05Z',
    level: 'info',
    message: 'Processing request #1234',
    metadata: { requestId: '1234' }
  },
  {
    agentId: '1',
    timestamp: '2024-02-26T15:30:10Z',
    level: 'warn',
    message: 'High latency detected',
    metadata: { latency: '2500ms' }
  },
  {
    agentId: '1',
    timestamp: '2024-02-26T15:30:15Z',
    level: 'error',
    message: 'Failed to connect to external API',
    metadata: { service: 'openai', error: 'timeout' }
  }
]

interface AgentLogsProps {
  agentId: string
}

export default function AgentLogs({ agentId }: AgentLogsProps) {
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all')

  useEffect(() => {
    async function loadLogs() {
      try {
        const response = await getAgentLogs(agentId)
        if (!response.success) {
          setError(response.error?.message || 'Failed to load logs')
          return
        }
        // In Designer Mode, use dummy data
        setLogs(DUMMY_LOGS)
      } catch {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [agentId])

  const filteredLogs = selectedLevel === 'all' 
    ? logs 
    : logs.filter(log => log.level === selectedLevel)

  const getLevelColor = (level: AgentLog['level']) => {
    switch (level) {
      case 'info': return 'bg-blue-500/20 text-blue-200'
      case 'warn': return 'bg-yellow-500/20 text-yellow-200'
      case 'error': return 'bg-red-500/20 text-red-200'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const handleDownload = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${
        log.metadata ? ` | ${JSON.stringify(log.metadata)}` : ''
      }`
    ).join('\n')

    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-${agentId}-logs.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Agent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Agent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Agent Logs</CardTitle>
          <Button
            onClick={handleDownload}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Download Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Log Level Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(['all', 'info', 'warn', 'error'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${
                selectedLevel === level
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900/50 border border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Logs List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredLogs.map((log, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{log.message}</p>
              {log.metadata && (
                <pre className="text-xs text-gray-400 bg-gray-900/50 rounded p-2 overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No logs found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 