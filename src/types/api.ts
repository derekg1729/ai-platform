export interface Model {
  id: string
  name: string
  description: string
  version: string
  category: string
  capabilities: string[]
  apiSpec: {
    input: Record<string, unknown>
    output: Record<string, unknown>
  }
  pricing: {
    type: 'free' | 'paid'
    amount?: number
    period?: 'monthly' | 'yearly'
  }
  stats: {
    rating: number
    reviews: number
    deployments: number
  }
}

export interface Agent {
  id: string
  modelId: string
  userId: string
  name: string
  status: 'configuring' | 'ready' | 'running' | 'stopped' | 'error'
  config: {
    apiKeys: Record<string, string>
    settings: Record<string, unknown>
  }
  metrics: {
    uptime: number
    requestsProcessed: number
    averageResponseTime: number
    lastActive: string
  }
  createdAt: string
  updatedAt: string
}

export interface AgentOutput {
  agentId: string
  timestamp: string
  type: 'result' | 'error' | 'info'
  content: unknown
  metadata?: Record<string, unknown>
}

export interface AgentLog {
  agentId: string
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  metadata?: Record<string, unknown>
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
} 