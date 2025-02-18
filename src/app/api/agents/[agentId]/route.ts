import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createErrorResponse, ApiError } from '@/lib/api-utils'

interface RouteParams {
  params: {
    agentId: string
  }
}

// Helper function to verify agent ownership
async function verifyAgentOwnership(agentId: string, userId: string) {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  })

  if (!agent) {
    throw new ApiError('Agent not found', 404, 'AGENT_NOT_FOUND')
  }

  if (agent.userId !== userId) {
    throw new ApiError('Unauthorized access to agent', 403, 'FORBIDDEN')
  }

  return agent
}

// GET /api/agents/[agentId] - Get a specific agent
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.$connect()
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      throw new ApiError('User ID is required', 401, 'UNAUTHORIZED')
    }

    await verifyAgentOwnership(params.agentId, userId)

    const agent = await prisma.agent.findUnique({
      where: { id: params.agentId },
      include: {
        model: true,
      },
    })

    return createApiResponse(agent)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
}

// PATCH /api/agents/[agentId] - Update an agent
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.$connect()
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      throw new ApiError('User ID is required', 401, 'UNAUTHORIZED')
    }

    await verifyAgentOwnership(params.agentId, userId)
    const data = await request.json()

    // Update the agent
    const agent = await prisma.agent.update({
      where: { id: params.agentId },
      data: {
        name: data.name,
        status: data.status,
        config: data.config,
        metrics: data.metrics,
      },
      include: {
        model: true,
      },
    })

    return createApiResponse(agent)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/agents/[agentId] - Delete an agent
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.$connect()
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      throw new ApiError('User ID is required', 401, 'UNAUTHORIZED')
    }

    await verifyAgentOwnership(params.agentId, userId)

    // Delete the agent
    await prisma.agent.delete({
      where: { id: params.agentId },
    })

    return createApiResponse({ message: 'Agent deleted successfully' })
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
} 