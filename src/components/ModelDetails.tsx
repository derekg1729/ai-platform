'use client'

import { useEffect, useState } from 'react'
import { Model, Agent } from '@/types/api'
import { getModel } from '@/lib/api/agents'
import { Button } from '@/components/ui/button'
import DeployModal from '@/components/DeployModal'

interface ModelDetailsProps {
  modelId: string
}

export default function ModelDetails({ modelId }: ModelDetailsProps) {
  const [model, setModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeployModal, setShowDeployModal] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getModel(modelId)
        if (response.success !== true) {
          setError(response.error?.message ?? 'Failed to load model details')
          return
        }
        setModel(response.data ?? null)
      } catch {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [modelId])

  function handleDeploySuccess(agent: Agent) {
    // Redirect to the agent details page
    window.location.href = `/agents/${agent.id}`
  }

  if (loading === true) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error != null && error.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 max-w-md text-center">
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    )
  }

  if (model == null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 max-w-md text-center">
          <p className="text-yellow-200">Model not found</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text mb-2">
                {model.name}
              </h1>
              <p className="text-gray-400">{model.description}</p>
            </div>
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => setShowDeployModal(true)}
            >
              Deploy Agent
            </Button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Version</dt>
                  <dd className="text-white">{model.version}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Category</dt>
                  <dd className="text-white">{model.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Rating</dt>
                  <dd className="text-white flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {model.stats.rating} ({model.stats.reviews} reviews)
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Active Deployments</dt>
                  <dd className="text-white">{model.stats.deployments}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {model.pricing.type === 'free' ? 'Free' : `$${model.pricing.amount}`}
                  {model.pricing.period != null && model.pricing.period.length > 0 && (
                    <span className="text-lg text-gray-400">/{model.pricing.period}</span>
                  )}
                </div>
                <Button 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  onClick={() => setShowDeployModal(true)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Capabilities</h2>
            <div className="flex flex-wrap gap-2">
              {model.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          {/* API Specification */}
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">API Specification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Input Schema</h3>
                <pre className="bg-gray-800/50 rounded-lg p-4 text-sm text-purple-400 overflow-auto">
                  {JSON.stringify(model.apiSpec.input, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Output Schema</h3>
                <pre className="bg-gray-800/50 rounded-lg p-4 text-sm text-purple-400 overflow-auto">
                  {JSON.stringify(model.apiSpec.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal === true && model != null && (
        <DeployModal
          model={model}
          onClose={() => setShowDeployModal(false)}
          onSuccess={handleDeploySuccess}
        />
      )}
    </>
  )
} 