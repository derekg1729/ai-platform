import { Agent, Model } from '@/types/api'

export const agentFixture: Agent = {
  id: 'test-agent-1',
  name: 'Test Agent',
  status: 'running',
  modelId: 'research-assistant-v1',
  config: {
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
  capabilities: ['Search academic papers', 'Generate citations'],
  apiSpec: {
    input: { type: 'string' },
    output: { type: 'string' },
  },
} 