import { PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// Create a singleton instance for tests
const testPrisma = prisma

export async function clearDatabase() {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  try {
    await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log('clearDatabase error:', error)
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
      email: 'test@example.com',
      name: 'Test User',
    },
  })
}

export const createTestModel = async () => {
  return await testPrisma.model.create({
    data: {
      id: 'test-model-1',
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
      name: 'Test Agent',
      status: 'active',
      userId,
      modelId,
      config: { settings: { temperature: 0.7 } },
      metrics: { uptime: 100 },
    },
  })
} 