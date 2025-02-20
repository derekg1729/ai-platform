import { PrismaClient as _PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// Create a singleton instance for tests
const testPrisma = prisma

// Counter for unique test IDs
let testCounter = 0

export async function clearDatabase() {
  try {
    // Delete all records in reverse order of dependencies
    await testPrisma.$transaction([
      testPrisma.agent.deleteMany(),
      testPrisma.model.deleteMany(),
      testPrisma.user.deleteMany(),
    ])
    
    // Reset counter
    testCounter = 0
  } catch (error) {
    console.error('clearDatabase error:', error)
    throw error
  }
}

export async function setupTestDatabase() {
  try {
    // Ensure connection
    await testPrisma.$connect()
    
    // Clear existing data
    await clearDatabase()
    
    // Reset counter
    testCounter = 0
  } catch (error) {
    console.error('Failed to setup test database:', error)
    throw error
  }
}

export async function teardownTestDatabase() {
  try {
    // Clear data
    await clearDatabase()
    
    // Disconnect
    await testPrisma.$disconnect()
  } catch (error) {
    console.error('Failed to teardown test database:', error)
    throw error
  }
}

export { testPrisma }

// Test data generators
export const createTestUser = async () => {
  testCounter++
  return await testPrisma.user.create({
    data: {
      name: 'Test User',
      email: `test-${testCounter}@example.com`,
    },
  })
}

export const createTestModel = async () => {
  testCounter++
  return await testPrisma.model.create({
    data: {
      id: `test-model-${testCounter}`,
      name: 'Test Model',
      description: 'A test model',
      version: '1.0.0',
      category: 'general',
      capabilities: ['test1', 'test2'],
      apiSpec: {
        input: { type: 'string' },
        output: { type: 'string' }
      },
      pricing: {
        type: 'free'
      },
      stats: {
        rating: 5,
        reviews: 0,
        deployments: 0
      },
    },
  })
}

export const createTestAgent = async (userId: string, modelId: string) => {
  testCounter++
  return await testPrisma.agent.create({
    data: {
      id: `test-agent-${testCounter}`,
      name: 'Test Agent',
      status: 'initializing',
      userId,
      modelId,
      config: {
        settings: {
          temperature: 0.7
        }
      },
      metrics: {
        lastActive: new Date(),
        uptime: 0,
        requestsProcessed: 0,
        averageResponseTime: 0
      },
    },
  })
} 