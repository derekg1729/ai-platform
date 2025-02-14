'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Agent } from '@/types/api'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { listUserAgents } from '@/lib/api/agents'

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await listUserAgents()
        if (!response.success || !response.data) {
          setError(response.error?.message || 'Failed to load agents')
          return
        }
        setAgents(response.data.items)
      } catch {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              My Agents
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your deployed AI agents
            </p>
          </div>
          <Button 
            className="bg-purple-500 hover:bg-purple-600"
            onClick={() => router.push('/marketplace')}
          >
            Deploy New Agent
          </Button>
        </div>

        <div className="grid gap-6">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className={`w-2 h-2 rounded-full ${
                      agent.status === 'running' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    {agent.status === 'running' ? 'Active' : 'Inactive'}
                    <span className="mx-2">•</span>
                    Last active {agent.metrics.lastActive}
                  </div>
                </div>
                <Link href={`/agents/${agent.id}`}>
                  <Button variant="outline" className="border-purple-500/50 text-purple-400">
                    Manage
                  </Button>
                </Link>
              </div>

              <div className="mt-4 grid gap-4">
                {Object.entries(agent.config.apiKeys).length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">API Keys</div>
                    {Object.entries(agent.config.apiKeys as Record<string, string>).map(([service, key]) => (
                      <div key={service} className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{service}</span>
                        <code className="text-sm text-purple-400">{key}</code>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Performance</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Uptime</div>
                      <div className="text-white">{agent.metrics.uptime}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Requests</div>
                      <div className="text-white">{agent.metrics.requestsProcessed}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Avg Response</div>
                      <div className="text-white">{agent.metrics.averageResponseTime}s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {agents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No agents deployed yet</h3>
              <p className="text-gray-400 mb-6">
                Deploy your first AI agent from the marketplace to get started
              </p>
              <Button 
                className="bg-purple-500 hover:bg-purple-600"
                onClick={() => router.push('/marketplace')}
              >
                Browse Models
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 