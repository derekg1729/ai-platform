'use client'

import { useState } from 'react'
import { Model, Agent } from '@/types/api'
import { deployAgent, configureAgent, startAgent } from '@/lib/api/agents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DeployModalProps {
  model: Model
  onClose: () => void
  onSuccess: (agent: Agent) => void
}

export default function DeployModal({
  model,
  onClose,
  onSuccess
}: DeployModalProps) {
  const [step, setStep] = useState<'config' | 'api_keys'>('config')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<Record<string, string>>({})

  async function handleDeploy() {
    setLoading(true)
    setError(null)

    try {
      // Deploy agent from model
      const deployResponse = await deployAgent(model.id, {
        name: config.name || `My ${model.name}`,
        settings: config
      })

      if (!deployResponse.success || !deployResponse.data) {
        throw new Error(deployResponse.error?.message || 'Failed to deploy agent')
      }

      // Configure agent with API keys
      const configureResponse = await configureAgent(deployResponse.data.id, {
        apiKeys: config
      })

      if (!configureResponse.success || !configureResponse.data) {
        throw new Error(configureResponse.error?.message || 'Failed to configure agent')
      }

      // Start agent
      const startResponse = await startAgent(configureResponse.data.id)

      if (!startResponse.success || !startResponse.data) {
        throw new Error(startResponse.error?.message || 'Failed to start agent')
      }

      onSuccess(startResponse.data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 border border-gray-700/50 rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Deploy {model.name}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {step === 'config' && (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Agent Name
                </label>
                <Input
                  type="text"
                  placeholder={`My ${model.name}`}
                  className="w-full bg-gray-800/50 border-gray-700/50 text-white"
                  value={config.name || ''}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                />
              </div>

              {/* Add more configuration fields based on model.apiSpec */}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setStep('api_keys')}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 'api_keys' && (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  API Key
                </label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  className="w-full bg-gray-800/50 border-gray-700/50 text-white font-mono"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Your API key will be encrypted and stored securely
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('config')}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleDeploy}
                className="bg-purple-500 hover:bg-purple-600"
                disabled={loading}
              >
                {loading ? 'Deploying...' : 'Deploy'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 