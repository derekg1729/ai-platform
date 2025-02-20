import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createErrorResponse, ApiError } from '@/lib/api-utils'
import { ModelValidationService } from '@/lib/services/model-validation'

interface RouteParams {
  params: {
    modelId: string
  }
}

// GET /api/models/[modelId] - Get a specific model
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.$connect()

    // Get model with usage statistics
    const model = await prisma.model.findUnique({
      where: { id: params.modelId },
      include: {
        _count: {
          select: { agents: true },
        },
      },
    })

    if (model == null) {
      throw new ApiError('Model not found', 404, 'MODEL_NOT_FOUND')
    }

    return createApiResponse(model)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
}

// PATCH /api/models/[modelId] - Update a model
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.$connect()

    // Check if model exists
    const existingModel = await prisma.model.findUnique({
      where: { id: params.modelId },
    })

    if (existingModel == null) {
      throw new ApiError('Model not found', 404, 'MODEL_NOT_FOUND')
    }

    // Validate update data
    const data = await request.json()
    const validatedData = ModelValidationService.validateModelUpdate(data)

    // Validate version if it's being updated
    if (validatedData.version != null && validatedData.version.length > 0) {
      if (ModelValidationService.validateVersion(validatedData.version) !== true) {
        throw new ApiError(
          'Invalid version format. Use semantic versioning (e.g., 1.0.0)',
          400,
          'INVALID_VERSION'
        )
      }

      if (ModelValidationService.isNewerVersion(validatedData.version, existingModel.version) !== true) {
        throw new ApiError(
          'New version must be higher than current version',
          400,
          'INVALID_VERSION_UPDATE'
        )
      }
    }

    // Update the model
    const model = await prisma.model.update({
      where: { id: params.modelId },
      data: validatedData,
    })

    return createApiResponse(model)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/models/[modelId] - Delete a model
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.$connect()

    // Check if model exists and has no agents
    const model = await prisma.model.findUnique({
      where: { id: params.modelId },
      include: {
        _count: {
          select: { agents: true },
        },
      },
    })

    if (!model) {
      throw new ApiError('Model not found', 404, 'MODEL_NOT_FOUND')
    }

    if (model._count.agents > 0) {
      throw new ApiError(
        'Cannot delete model with active agents',
        409,
        'MODEL_HAS_AGENTS'
      )
    }

    // Delete the model
    await prisma.model.delete({
      where: { id: params.modelId },
    })

    return createApiResponse({ message: 'Model deleted successfully' })
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
} 