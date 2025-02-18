import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api-utils'
import { AgentValidationService, verifyAgentOwnership } from './agent-validation'
import { ModelService } from './model-service'
import { Agent, AgentStatus } from '@prisma/client'

export class AgentService {
  /**
   * Creates a new agent
   */
  static async createAgent(data: {
    name: string
    modelId: string
    userId: string
    config?: Record<string, any>
  }): Promise<Agent> {
    // Verify model exists
    const model = await ModelService.getModel(data.modelId)
    if (!model) {
      throw new ApiError('Model not found', 404, 'MODEL_NOT_FOUND')
    }

    // Create agent with default values
    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        modelId: data.modelId,
        userId: data.userId,
        status: 'initializing',
        config: data.config || {},
        metrics: {
          uptime: 0,
          requestsProcessed: 0,
          averageResponseTime: 0,
          lastActive: new Date(),
        },
      },
    })

    return agent
  }

  /**
   * Updates an existing agent
   */
  static async updateAgent(
    agentId: string,
    userId: string,
    data: Partial<Agent>
  ): Promise<Agent> {
    // Verify ownership
    const existingAgent = await verifyAgentOwnership(agentId, userId)

    // Validate update data
    AgentValidationService.validateAgentUpdate(data)

    // Validate status transition if status is being updated
    if (data.status && data.status !== existingAgent.status) {
      AgentValidationService.validateStatusTransition(
        existingAgent.status,
        data.status
      )
    }

    // Update agent
    const updatedAgent = await prisma.agent.update({
      where: { id: agentId },
      data,
    })

    return updatedAgent
  }

  /**
   * Deletes an agent
   */
  static async deleteAgent(agentId: string, userId: string): Promise<void> {
    // Verify ownership
    await verifyAgentOwnership(agentId, userId)

    // Delete agent
    await prisma.agent.delete({
      where: { id: agentId },
    })
  }

  /**
   * Gets an agent by ID
   */
  static async getAgent(agentId: string, userId: string): Promise<Agent> {
    return await verifyAgentOwnership(agentId, userId)
  }

  /**
   * Lists all agents for a user
   */
  static async listAgents(userId: string): Promise<Agent[]> {
    return await prisma.agent.findMany({
      where: { userId },
    })
  }

  /**
   * Updates agent metrics
   */
  static async updateMetrics(
    agentId: string,
    metrics: {
      uptime: number
      requestsProcessed: number
      averageResponseTime: number
      lastActive: Date
    }
  ): Promise<Agent> {
    // Validate metrics
    AgentValidationService.validateMetrics({
      ...metrics,
      lastActive: metrics.lastActive.toISOString(),
    })

    // Update agent metrics
    return await prisma.agent.update({
      where: { id: agentId },
      data: { metrics },
    })
  }

  /**
   * Updates agent configuration
   */
  static async updateConfig(
    agentId: string,
    userId: string,
    config: Record<string, any>
  ): Promise<Agent> {
    // Verify ownership
    await verifyAgentOwnership(agentId, userId)

    // Validate configuration
    AgentValidationService.validateConfig(config)

    // Update agent config
    return await prisma.agent.update({
      where: { id: agentId },
      data: { config },
    })
  }

  /**
   * Starts an agent
   */
  static async startAgent(agentId: string, userId: string): Promise<Agent> {
    const agent = await this.updateAgent(agentId, userId, {
      status: 'running' as AgentStatus,
    })

    // TODO: Implement agent startup logic
    // - Initialize runtime environment
    // - Load model
    // - Start processing queue
    // - Set up monitoring

    return agent
  }

  /**
   * Stops an agent
   */
  static async stopAgent(agentId: string, userId: string): Promise<Agent> {
    const agent = await this.updateAgent(agentId, userId, {
      status: 'stopped' as AgentStatus,
    })

    // TODO: Implement agent shutdown logic
    // - Stop processing queue
    // - Clean up resources
    // - Save state if needed
    // - Update metrics

    return agent
  }

  /**
   * Restarts an agent
   */
  static async restartAgent(agentId: string, userId: string): Promise<Agent> {
    await this.stopAgent(agentId, userId)
    return await this.startAgent(agentId, userId)
  }
} 