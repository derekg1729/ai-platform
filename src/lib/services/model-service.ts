import { prisma } from '@/lib/prisma'
import { Model } from '@prisma/client'

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