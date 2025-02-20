'use client'

import { useEffect, useState } from 'react'
import { getAgentLogs } from '@/lib/api/agents'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AgentLog } from '@/types/api'

interface AgentLogsProps {
  agentId: string
}

export default function AgentLogs({ agentId }: AgentLogsProps) {
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all')

  useEffect(() => {
    const fetchLogs = async () => {
      await loadLogs()
    }
    void fetchLogs()
  }, [agentId])

  const loadLogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getAgentLogs(agentId)
      if (!response.success || !response.data) {
        throw new Error(response.error?.message ?? 'Failed to load logs')
      }

      setLogs(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = selectedLevel === 'all' 
    ? logs 
    : logs.filter(log => log.level === selectedLevel)

  const getLevelColor = (level: AgentLog['level']) => {
    switch (level) {
      case 'info':
        return 'bg-blue-500/20 text-blue-200'
      case 'warn':
        return 'bg-yellow-500/20 text-yellow-200'
      case 'error':
        return 'bg-red-500/20 text-red-200'
      default:
        return 'bg-gray-500/20 text-gray-400'
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
          <div className="text-center py-8">
            <p className="text-gray-400">Loading logs...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error !== null) {
    return (
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Agent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Agent Logs</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={selectedLevel === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLevel('all')}
          >
            All
          </Button>
          <Button
            variant={selectedLevel === 'info' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLevel('info')}
          >
            Info
          </Button>
          <Button
            variant={selectedLevel === 'warn' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLevel('warn')}
          >
            Warn
          </Button>
          <Button
            variant={selectedLevel === 'error' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLevel('error')}
          >
            Error
          </Button>
        </div>
        <Button
          onClick={handleDownload}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Download Logs
        </Button>
      </CardHeader>
      <CardContent>
        {/* Logs List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div 
              key={`${log.agentId}-${log.timestamp}`}
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