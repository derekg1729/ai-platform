import { Agent, Model } from '@/types/api'

export const agentFixture: Agent = {
  id: 'test-agent-1',
  name: 'Test Agent',
  status: 'running',
  modelId: 'research-assistant-v1',
  userId: 'test-user-1',
  createdAt: '2024-02-18T10:00:00Z',
  updatedAt: '2024-02-18T10:00:00Z',
  metrics: {
    lastActive: '2 hours ago',
    uptime: 99.9,
    requestsProcessed: 1500,
    averageResponseTime: 0.8
  },
  config: {
    apiKeys: {},
    settings: {
      temperature: 0.7,
      maxTokens: 1000,
    },
  },
}

export const modelFixture: Model = {
  id: 'research-assistant-v1',
  name: 'Research Assistant',
  description: 'AI research assistant model',
  version: '1.0.0',
  category: 'Research',
  capabilities: ['Search academic papers', 'Generate citations'],
  apiSpec: {
    input: { type: 'string' },
    output: { type: 'string' },
  },
  pricing: {
    type: 'paid',
    amount: 10,
    period: 'monthly'
  },
  stats: {
    rating: 4.8,
    reviews: 120,
    deployments: 500
  }
} 