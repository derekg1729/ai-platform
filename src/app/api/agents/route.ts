import { NextRequest, NextResponse } from 'next/server'
import { AgentService } from '@/lib/services/agent-service'
import { getUserIdFromRequest } from '@/lib/auth'
import { ApiError } from '@/lib/api-utils'
import { createApiResponse, createErrorResponse } from '@/lib/api-utils'

/**
 * GET /api/agents
 * List all agents for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    const agents = await AgentService.listAgents(userId)
    return createApiResponse(agents)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
}

/**
 * POST /api/agents
 * Create a new agent
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.modelId) {
      throw new ApiError('Missing required fields: name, modelId', 400, 'MISSING_REQUIRED_FIELDS')
    }

    const agent = await AgentService.createAgent({
      name: data.name,
      modelId: data.modelId,
      userId,
      config: data.config,
    })

    return createApiResponse(agent, 201)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
} 