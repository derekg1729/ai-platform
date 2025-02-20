import { prisma } from '@/lib/prisma'
import { createApiResponse, createErrorResponse } from '@/lib/api-utils'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return createApiResponse({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return createErrorResponse(new Error('Database connection failed'))
  }
} 