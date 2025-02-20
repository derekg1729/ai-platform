import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api-utils'
import { z } from 'zod'

// Agent configuration schema
export const AgentConfigSchema = z.record(z.unknown()).default({})

// Agent metrics schema
export const AgentMetricsSchema = z.object({
  uptime: z.number().min(0).default(0),
  requestsProcessed: z.number().min(0).default(0),
  averageResponseTime: z.number().min(0).default(0),
  lastActive: z.string().datetime().default(() => new Date().toISOString()),
}).default({
  uptime: 0,
  requestsProcessed: 0,
  averageResponseTime: 0,
  lastActive: new Date().toISOString(),
})

// Agent status schema
export const AgentStatusSchema = z.enum([
  'initializing',
  'ready',
  'running',
  'stopped',
  'error',
])

// Agent schema
export const AgentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  modelId: z.string().min(1),
  userId: z.string().min(1),
  status: AgentStatusSchema.default('initializing'),
  config: AgentConfigSchema,
  metrics: AgentMetricsSchema,
})

// Agent update schema
export const AgentUpdateSchema = AgentSchema.partial()

export class AgentValidationService {
  /**
   * Validates complete agent data
   */
  static validateAgent(data: unknown) {
    try {
      return AgentSchema.parse(data)
    } catch (error) {
      throw new ApiError(
        'Invalid agent data: ' + this.formatZodError(error),
        400,
        'INVALID_AGENT_DATA'
      )
    }
  }

  /**
   * Validates partial agent update
   */
  static validateAgentUpdate(data: unknown) {
    try {
      return AgentUpdateSchema.parse(data)
    } catch (error) {
      throw new ApiError(
        'Invalid agent update data: ' + this.formatZodError(error),
        400,
        'INVALID_AGENT_UPDATE'
      )
    }
  }

  /**
   * Validates agent configuration
   */
  static validateConfig(config: unknown) {
    try {
      return AgentConfigSchema.parse(config)
    } catch (error) {
      throw new ApiError(
        'Invalid agent configuration: ' + this.formatZodError(error),
        400,
        'INVALID_AGENT_CONFIG'
      )
    }
  }

  /**
   * Validates agent metrics
   */
  static validateMetrics(metrics: unknown) {
    try {
      return AgentMetricsSchema.parse(metrics)
    } catch (error) {
      throw new ApiError(
        'Invalid agent metrics: ' + this.formatZodError(error),
        400,
        'INVALID_AGENT_METRICS'
      )
    }
  }

  /**
   * Validates agent status transition
   */
  static validateStatusTransition(currentStatus: string, newStatus: string) {
    const validTransitions: Record<string, string[]> = {
      initializing: ['ready', 'error'],
      ready: ['running', 'error'],
      running: ['stopped', 'error'],
      stopped: ['running', 'error'],
      error: ['initializing'],
    }

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new ApiError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400,
        'INVALID_STATUS_TRANSITION'
      )
    }
  }

  /**
   * Formats Zod validation errors
   */
  private static formatZodError(error: unknown): string {
    if (error !== null && typeof error === 'object' && 'errors' in error && Array.isArray((error as { errors: unknown[] }).errors)) {
      return ((error as { errors: { message: string }[] }).errors)
        .map((e) => e.message)
        .join(', ')
    }
    return 'Unknown validation error'
  }
}

/**
 * Verifies agent ownership and returns the agent
 */
export async function verifyAgentOwnership(agentId: string, userId: string) {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  })

  if (agent === null) {
    throw new ApiError('Agent not found', 404, 'AGENT_NOT_FOUND')
  }

  if (agent.userId !== userId) {
    throw new ApiError('Unauthorized access to agent', 403, 'FORBIDDEN')
  }

  return agent
}

/**
 * Validates agent resource requirements
 */
export async function validateResourceRequirements(_agent: z.infer<typeof AgentSchema>) {
  // TODO: Implement resource validation
  // - Check compute requirements
  // - Validate storage needs
  // - Verify network capacity
  // - Check quota limits
}

/**
 * Validates agent API keys
 */
export async function validateApiKeys(agent: z.infer<typeof AgentSchema>) {
  const config = agent.config
  const apiKeys = (config.apiKeys as Record<string, string>) ?? {}
  
  for (const [service, key] of Object.entries(apiKeys)) {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new ApiError(`Invalid API key for service: ${service}`, 400, 'INVALID_API_KEY')
    }
  }
}

/**
 * Validates agent settings
 */
export async function validateSettings(_agent: z.infer<typeof AgentSchema>) {
  const config = _agent.config
  const _settings = (config.settings as Record<string, unknown>) ?? {}
  
  // TODO: Implement settings validation
  // - Check required settings
  // - Validate setting types
  // - Verify setting ranges
  // - Check dependencies
} 