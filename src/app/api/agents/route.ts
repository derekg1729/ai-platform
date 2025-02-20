import { NextRequest } from 'next/server'
import { AgentService } from '@/lib/services/agent-service'
import { getUserIdFromRequest } from '@/lib/auth'
import { ApiError } from '@/lib/api-utils'
import { createApiResponse, createErrorResponse } from '@/lib/api-utils'
import { z } from 'zod'

// Request validation schema
const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  modelId: z.string().min(1, 'Model ID is required'),
  config: z.record(z.unknown()).optional()
})

type _CreateAgentRequest = z.infer<typeof createAgentSchema>

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
    const rawData = await req.json()
    
    // Validate request data
    const result = createAgentSchema.safeParse(rawData)
    if (!result.success) {
      throw new ApiError(
        'Invalid request data: ' + result.error.message,
        400,
        'INVALID_REQUEST_DATA'
      )
    }
    
    const data = result.data
    const agent = await AgentService.createAgent({
      name: data.name,
      modelId: data.modelId,
      userId,
      config: data.config
    })

    return createApiResponse(agent, 201)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
} 