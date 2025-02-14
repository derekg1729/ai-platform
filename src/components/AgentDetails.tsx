'use client'

import { useEffect, useState } from 'react'
import { Agent, Model } from '@/types/api'
import { getAgent, getModel } from '@/lib/api/agents'
import { Button } from '@/components/ui/button'
import AgentUsageGraph from '@/components/AgentUsageGraph'
import AgentFeedback from '@/components/AgentFeedback'
import AgentLogs from './AgentLogs'

interface ApiConnection {
  id: string
  name: string
  description: string
  status: 'configured' | 'not_configured' | 'error'
  lastChecked?: string
  errorMessage?: string
}

// Dummy API connections data
const DUMMY_CONNECTIONS: Record<string, ApiConnection[]> = {
  'research-assistant-v1': [
    {
      id: 'academic-db',
      name: 'Academic Database API',
      description: 'Access to research papers and academic publications',
      status: 'configured',
      lastChecked: '2024-02-26T15:30:00Z'
    },
    {
      id: 'citation-api',
      name: 'Citation Manager',
      description: 'Generate and format academic citations',
      status: 'error',
      lastChecked: '2024-02-26T15:30:00Z',
      errorMessage: 'API key expired'
    }
  ],
  'code-copilot-v2': [
    {
      id: 'github',
      name: 'GitHub API',
      description: 'Access to repositories and code analysis',
      status: 'configured',
      lastChecked: '2024-02-26T15:30:00Z'
    },
    {
      id: 'vscode',
      name: 'VS Code Extension API',
      description: 'Integration with VS Code editor',
      status: 'not_configured'
    }
  ]
}

interface AgentDetailsProps {
  agentId: string
}

export default function AgentDetails({ agentId }: AgentDetailsProps) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [model, setModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const agentResponse = await getAgent(agentId)
        if (!agentResponse.success || !agentResponse.data) {
          throw new Error(agentResponse.error?.message || 'Failed to load agent')
        }
        setAgent(agentResponse.data)

        const modelResponse = await getModel(agentResponse.data.modelId)
        if (!modelResponse.success || !modelResponse.data) {
          throw new Error(modelResponse.error?.message || 'Failed to load model')
        }
        setModel(modelResponse.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [agentId])

  const getStatusColor = (status: ApiConnection['status']) => {
    switch (status) {
      case 'configured': return 'bg-green-500/20 text-green-200'
      case 'not_configured': return 'bg-yellow-500/20 text-yellow-200'
      case 'error': return 'bg-red-500/20 text-red-200'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !agent || !model) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 max-w-md text-center">
          <p className="text-red-200">{error || 'Agent not found'}</p>
        </div>
      </div>
    )
  }

  const connections = DUMMY_CONNECTIONS[model.id] || []

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{agent.name}</h1>
            <p className="text-gray-400 max-w-2xl mb-6">{model.description}</p>
            
            {/* Agent Specifications and Connections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
              {/* Left Column - Specifications */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Specifications</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-purple-400 mb-2">Input</h3>
                    <div className="bg-gray-900/50 rounded p-3 border border-gray-700/50">
                      <code className="text-sm text-gray-300 font-mono">
                        {JSON.stringify(model.apiSpec.input, null, 2)}
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-purple-400 mb-2">Agent Processing</h3>
                    <div className="bg-gray-900/50 rounded p-3 border border-gray-700/50">
                      <ul className="text-sm text-gray-300 space-y-1">
                        {model.capabilities.map((capability, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-purple-400">•</span>
                            {capability}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-purple-400 mb-2">Output</h3>
                    <div className="bg-gray-900/50 rounded p-3 border border-gray-700/50">
                      <code className="text-sm text-gray-300 font-mono">
                        {JSON.stringify(model.apiSpec.output, null, 2)}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Required Connections */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Required Connections</h2>
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div 
                      key={connection.id}
                      className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-medium">{connection.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(connection.status)}`}>
                          {connection.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{connection.description}</p>
                      {connection.errorMessage && (
                        <p className="text-sm text-red-400 mb-2">{connection.errorMessage}</p>
                      )}
                      {connection.lastChecked && (
                        <p className="text-xs text-gray-500 mb-2">
                          Last checked: {new Date(connection.lastChecked).toLocaleString()}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      >
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              agent.status === 'running' ? 'bg-green-500/20 text-green-200' :
              agent.status === 'stopped' ? 'bg-red-500/20 text-red-200' :
              'bg-yellow-500/20 text-yellow-200'
            }`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </span>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {agent.status === 'running' ? 'Stop Agent' : 'Start Agent'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <AgentUsageGraph />

          {/* Configuration */}
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(agent.config.settings || {}).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300">{key}</label>
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2">
                    <code className="text-sm text-white">{String(value)}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AgentFeedback agentId={agentId} />
        </div>
      </div>

      <div className="mt-8">
        <AgentLogs agentId={agent.id} />
      </div>
    </div>
  )
} 