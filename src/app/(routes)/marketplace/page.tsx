'use client'

import { useEffect, useState } from 'react'
import { Model } from '@/types/api'
import { listModels } from '@/lib/api/agents'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MarketplacePage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    async function loadModels() {
      try {
        const response = await listModels()
        if (response.success && response.data) {
          setModels(response.data.items)
        } else {
          setError(response.error?.message || 'Failed to load models')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadModels()
  }, [])

  const categories = ['all', ...new Set(models.map(model => model.category.toLowerCase()))]
  const filteredModels = selectedCategory === 'all' 
    ? models 
    : models.filter(model => model.category.toLowerCase() === selectedCategory)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              AI Model Marketplace
            </h1>
            <p className="text-gray-400 mt-2">
              Deploy powerful AI models as personalized agents
            </p>
          </div>
          <Button 
            className="bg-purple-500 hover:bg-purple-600"
            onClick={() => window.open('/docs/submit-model', '_blank')}
          >
            Submit Model
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900/50 border border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Model Grid */}
        <div className="grid gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {model.name}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {model.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-400">
                      {model.pricing.type === 'free' ? 'Free' : `$${model.pricing.amount}/${model.pricing.period}`}
                    </span>
                    <span className="text-gray-400">v{model.version}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">{model.stats.rating}</span>
                      <span className="text-gray-400">({model.stats.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <div className="text-sm font-medium text-gray-400">
                    {model.stats.deployments.toLocaleString()} deployments
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end mb-4">
                    {model.capabilities.slice(0, 2).map((capability) => (
                      <span
                        key={capability}
                        className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                    {model.capabilities.length > 2 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                        +{model.capabilities.length - 2} more
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/models/${model.id}`}>
                      <Button variant="outline" className="border-purple-500/50 text-purple-400">
                        Learn More
                      </Button>
                    </Link>
                    <Button className="bg-purple-500 hover:bg-purple-600">
                      Deploy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 