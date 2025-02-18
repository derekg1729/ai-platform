import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createErrorResponse, ApiError } from '@/lib/api-utils'
import { ModelValidationService } from '@/lib/services/model-validation'
import { ModelCategories } from '@/lib/validation/model-schemas'

// GET /api/models - List all models
export async function GET(request: NextRequest) {
  try {
    await prisma.$connect()

    // Parse query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const minVersion = url.searchParams.get('minVersion')
    const capabilities = url.searchParams.get('capabilities')?.split(',')

    // Build where clause
    const where: any = {}
    if (category) {
      if (!ModelCategories.includes(category as any)) {
        throw new ApiError('Invalid category', 400, 'INVALID_CATEGORY')
      }
      where.category = category
    }

    // Get models
    const models = await prisma.model.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    })

    // Apply additional filters
    let filteredModels = models

    // Filter by minimum version
    if (minVersion && ModelValidationService.validateVersion(minVersion)) {
      filteredModels = filteredModels.filter((model) =>
        ModelValidationService.isNewerVersion(model.version, minVersion)
      )
    }

    // Filter by capabilities
    if (capabilities && capabilities.length > 0) {
      filteredModels = filteredModels.filter((model) =>
        ModelValidationService.validateCapabilities(model.capabilities, capabilities)
      )
    }

    return createApiResponse(filteredModels)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/models - Create a new model
export async function POST(request: NextRequest) {
  try {
    await prisma.$connect()

    // Validate model data
    const data = await request.json()
    const validatedData = ModelValidationService.validateModel(data)

    // Check if model with ID already exists
    const existingModel = await prisma.model.findUnique({
      where: { id: validatedData.id },
    })

    if (existingModel) {
      throw new ApiError('Model with this ID already exists', 409, 'MODEL_EXISTS')
    }

    // Create the model
    const model = await prisma.model.create({
      data: validatedData,
    })

    return createApiResponse(model, 201)
  } catch (error) {
    return createErrorResponse(error as Error)
  } finally {
    await prisma.$disconnect()
  }
} 