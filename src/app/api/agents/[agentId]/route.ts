import { NextRequest, NextResponse } from 'next/server'
import { AgentService } from '@/lib/services/agent-service'
import { AgentRuntime } from '@/lib/services/agent-runtime'
import { getUserIdFromRequest } from '@/lib/auth'
import { ApiError } from '@/lib/api-utils'
import { createApiResponse, createErrorResponse } from '@/lib/api-utils'

/**
 * GET /api/agents/[agentId]
 * Get a specific agent
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req)
    const agent = await AgentService.getAgent(params.agentId, userId)
    return createApiResponse(agent)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
}

/**
 * PATCH /api/agents/[agentId]
 * Update a specific agent
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req)
    const data = await req.json()

    const agent = await AgentService.updateAgent(params.agentId, userId, data)
    return createApiResponse(agent)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
}

/**
 * DELETE /api/agents/[agentId]
 * Delete a specific agent
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req)
    await AgentService.deleteAgent(params.agentId, userId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
}

/**
 * POST /api/agents/[agentId]/start
 * Start a specific agent
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req)
    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'start':
        await AgentRuntime.startAgent(params.agentId, userId)
        return createApiResponse({ status: 'started' })

      case 'stop':
        await AgentRuntime.stopAgent(params.agentId, userId)
        return createApiResponse({ status: 'stopped' })

      case 'process':
        const request = await req.json()
        const response = await AgentRuntime.processRequest(params.agentId, request)
        return createApiResponse(response)

      default:
        throw new ApiError(`Invalid action: ${action}`, 400, 'INVALID_ACTION')
    }
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
} 