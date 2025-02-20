import { NextRequest, _NextResponse } from 'next/server'
import { AgentRuntime } from '@/lib/services/agent-runtime'
import { getUserIdFromRequest } from '@/lib/auth'
import { ApiError } from '@/lib/api-utils'
import { createApiResponse, createErrorResponse } from '@/lib/api-utils'

/**
 * POST /api/agents/[agentId]/[action]
 * Handle agent actions: start, stop, process
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { agentId: string; action: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req)

    switch (params.action) {
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
        throw new ApiError(`Invalid action: ${params.action}`, 400, 'INVALID_ACTION')
    }
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
}

/**
 * GET /api/agents/[agentId]/[action]
 * Handle agent status queries
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { agentId: string; action: string } }
) {
  try {
    const _userId = await getUserIdFromRequest(req)

    switch (params.action) {
      case 'status':
        // TODO: Implement status check
        return createApiResponse({
          status: 'not_implemented',
          message: 'Status check not implemented',
        })

      case 'metrics':
        // TODO: Implement metrics retrieval
        return createApiResponse({
          status: 'not_implemented',
          message: 'Metrics retrieval not implemented',
        })

      default:
        throw new ApiError(`Invalid action: ${params.action}`, 400, 'INVALID_ACTION')
    }
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error)
    }
    return createErrorResponse(new Error('Unknown error occurred'))
  }
} 