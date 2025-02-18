import { NextResponse } from 'next/server'

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function createApiResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}

export function createErrorResponse(
  error: Error | ApiError,
  statusCode: number = 500
): NextResponse<ApiResponse<never>> {
  const code = error instanceof ApiError ? error.statusCode : statusCode
  
  return NextResponse.json(
    {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    },
    { status: code }
  )
}

// Validation utilities
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missingFields = requiredFields.filter(field => !data[field])
  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS'
    )
  }
} 