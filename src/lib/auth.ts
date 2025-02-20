import { NextRequest } from 'next/server'
import { ApiError } from './api-utils'
import { prisma } from './prisma'

/**
 * Gets the user ID from the request headers and validates it
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string> {
  const userId = req.headers.get('x-user-id')
  if (userId === null || userId === '') {
    throw new ApiError('User ID is required', 401, 'UNAUTHORIZED')
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
  }

  return userId
}

/**
 * Validates that a user has the required role
 */
export async function validateUserRole(userId: string, requiredRole: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
  }

  if (user.role !== requiredRole) {
    throw new ApiError('Insufficient permissions', 403, 'FORBIDDEN')
  }
}

/**
 * Gets the user's role
 */
export async function getUserRole(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
  }

  return user.role
} 