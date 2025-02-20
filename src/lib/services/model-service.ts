import { prisma } from '@/lib/prisma'
import type { PrismaClient } from '@prisma/client'

type Model = PrismaClient['model']['fields']

export class ModelService {
  /**
   * Gets a model by ID
   */
  static async getModel(modelId: string): Promise<Model | null> {
    return await prisma.model.findUnique({
      where: { id: modelId },
    })
  }
} 