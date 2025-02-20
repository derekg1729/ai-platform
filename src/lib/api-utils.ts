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
): Response {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }

  return new Response(
    JSON.stringify(response),
    { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
}

export function createErrorResponse(
  error: Error | ApiError,
  statusCode: number = 500
): Response {
  const code = error instanceof ApiError ? error.statusCode : statusCode
  
  const response = {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString(),
  }

  return new Response(
    JSON.stringify(response),
    { 
      status: code,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
}

// Validation utilities
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missingFields = requiredFields.filter(field => data[field] == null)
  if (missingFields.length > 0) {
    throw new ApiError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS'
    )
  }
} 