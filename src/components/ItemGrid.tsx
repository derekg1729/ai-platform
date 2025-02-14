'use client'

import Link from 'next/link'
import { Model } from '@/types/api'
import { listModels } from '@/lib/api/agents'
import { useEffect, useState } from 'react'

export default function ItemGrid() {
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    async function loadModels() {
      const response = await listModels()
      if (response.success && response.data) {
        setModels(response.data.items)
      }
    }
    loadModels()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {models.map((model) => (
        <Link
          key={model.id}
          href={`/models/${model.id}`}
          className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-start space-x-4">
            <div 
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded text-black font-bold"
              style={{
                backgroundColor: 
                  model.category === 'Research' ? '#a78bfa' : // purple for Research
                  model.category === 'Development' ? '#60a5fa' : // blue for Development
                  model.category === 'Marketing' ? '#34d399' : // green for Marketing
                  model.category === 'Analytics' ? '#f87171' : // red for Analytics
                  '#9ca3af' // default gray
              }}
            >
              {model.name.split(' ').map(word => word[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                <span className="text-xs text-gray-400">v{model.version}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{model.description}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-300">{model.stats.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">
                    {model.pricing.type === 'free' ? 'Free' : `$${model.pricing.amount}/${model.pricing.period}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 