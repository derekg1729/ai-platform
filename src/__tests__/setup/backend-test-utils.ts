import { PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

// Create a singleton instance for tests
const testPrisma = prisma

export async function clearDatabase() {
  try {
    // Delete all records in reverse order of dependencies
    await testPrisma.agent.deleteMany()
    await testPrisma.model.deleteMany()
    await testPrisma.user.deleteMany()
  } catch (error) {
    console.error('clearDatabase error:', error)
    throw error
  }
}

export async function setupTestDatabase() {
  try {
    await clearDatabase()
  } catch (error) {
    console.error('Failed to setup test database:', error)
    throw error
  }
}

export { testPrisma }

// Test data generators
export const createTestUser = async () => {
  return await testPrisma.user.create({
    data: {
      id: uuidv4(),
      email: `test-${uuidv4()}@example.com`,
      name: 'Test User',
    },
  })
}

export const createTestModel = async () => {
  return await testPrisma.model.create({
    data: {
      id: `test-model-${uuidv4()}`,
      name: 'Test Model',
      description: 'A test model',
      version: '1.0.0',
      category: 'test',
      capabilities: ['test1', 'test2'],
      apiSpec: { input: { type: 'string' }, output: { type: 'string' } },
      pricing: { type: 'free' },
      stats: { rating: 5 },
    },
  })
}

export const createTestAgent = async (userId: string, modelId: string) => {
  return await testPrisma.agent.create({
    data: {
      id: uuidv4(),
      name: 'Test Agent',
      status: 'active',
      userId,
      modelId,
      config: { settings: { temperature: 0.7 } },
      metrics: { uptime: 100 },
    },
  })
} 