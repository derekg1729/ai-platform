import { ApiError } from '@/lib/api-utils'
import {
  ModelSchema,
  ModelUpdateSchema,
  ApiSpecSchema,
  type Model,
  type ModelUpdate,
  type ApiSpec,
} from '@/lib/validation/model-schemas'

export class ModelValidationService {
  /**
   * Validates a complete model object
   */
  static validateModel(data: unknown): Model {
    try {
      return ModelSchema.parse(data)
    } catch (error) {
      throw new ApiError(
        'Invalid model data: ' + this.formatZodError(error),
        400,
        'INVALID_MODEL_DATA'
      )
    }
  }

  /**
   * Validates a partial model update
   */
  static validateModelUpdate(data: unknown): ModelUpdate {
    try {
      return ModelUpdateSchema.parse(data)
    } catch (error) {
      throw new ApiError(
        'Invalid model update data: ' + this.formatZodError(error),
        400,
        'INVALID_MODEL_UPDATE'
      )
    }
  }

  /**
   * Validates an API specification
   */
  static validateApiSpec(spec: unknown): ApiSpec {
    try {
      return ApiSpecSchema.parse(spec)
    } catch (error) {
      throw new ApiError(
        'Invalid API specification: ' + this.formatZodError(error),
        400,
        'INVALID_API_SPEC'
      )
    }
  }

  /**
   * Validates model version against semantic versioning
   */
  static validateVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version)
  }

  /**
   * Compares two versions and returns true if version1 is newer than version2
   */
  static isNewerVersion(version1: string, version2: string): boolean {
    const v1 = version1.split('.').map(Number)
    const v2 = version2.split('.').map(Number)

    for (let i = 0; i < 3; i++) {
      if (v1[i] > v2[i]) return true
      if (v1[i] < v2[i]) return false
    }

    return false
  }

  /**
   * Validates model capabilities against required capabilities
   */
  static validateCapabilities(
    capabilities: string[],
    requiredCapabilities: string[]
  ): boolean {
    return requiredCapabilities.every((cap) => capabilities.includes(cap))
  }

  /**
   * Formats Zod validation errors into a readable string
   */
  private static formatZodError(error: unknown): string {
    if (error !== null && typeof error === 'object' && 'errors' in error && Array.isArray((error as { errors: unknown[] }).errors)) {
      return ((error as { errors: { message: string }[] }).errors)
        .map((e) => e.message)
        .join(', ')
    }
    return 'Unknown validation error'
  }
} 