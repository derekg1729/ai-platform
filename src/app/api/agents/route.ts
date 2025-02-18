import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createErrorResponse, validateRequiredFields, ApiError } from '@/lib/api-utils'

// GET /api/agents - List all agents for a user
export async function GET(request: NextRequest) {
  try {
    await prisma.$connect()
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      throw new ApiError('User ID is required', 401, 'UNAUTHORIZED')
    }

    const agents = await prisma.agent.findMany({
      where: {
        userId,
      },
      include: {
        model: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return createApiResponse(agents)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    await prisma.$connect()
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      throw new ApiError('User ID is required', 401, 'UNAUTHORIZED')
    }

    const data = await request.json()

    // Validate required fields
    validateRequiredFields(data, [
      'name',
      'modelId',
      'config',
    ])

    // Check if model exists
    const model = await prisma.model.findUnique({
      where: { id: data.modelId },
    })

    if (!model) {
      throw new ApiError('Model not found', 404, 'MODEL_NOT_FOUND')
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
    }

    // Create the agent
    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        status: 'initializing', // Default status for new agents
        modelId: data.modelId,
        userId,
        config: data.config,
        metrics: data.metrics || { // Default metrics
          lastActive: new Date().toISOString(),
          uptime: 0,
          requestsProcessed: 0,
          averageResponseTime: 0,
        },
      },
      include: {
        model: true,
      },
    })

    return createApiResponse(agent, 201)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
} 