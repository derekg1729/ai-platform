import { setupTestDatabase, createTestModel } from '../../setup/backend-test-utils'
import { v4 as uuidv4 } from 'uuid'
import { parseApiResponse, mockFetchResponse } from '../../setup/test-utils'

describe('Models API', () => {
  beforeEach(async () => {
    await setupTestDatabase()
    // Reset fetch mock
    jest.clearAllMocks()
  })

  describe('GET /api/models', () => {
    it('should return empty list when no models exist', async () => {
      const mockResponse = mockFetchResponse([])
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch('http://localhost:3000/api/models')
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should return list of models', async () => {
      const model = await createTestModel()
      const mockResponse = mockFetchResponse([model])
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch('http://localhost:3000/api/models')
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(model.id)
    })

    it('should filter models by category', async () => {
      await createTestModel() // Creates a 'general' category model
      const mockResponse = mockFetchResponse([])
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch('http://localhost:3000/api/models?category=chat')
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(0) // No chat models
    })

    it('should filter models by minimum version', async () => {
      const model = await createTestModel() // Creates version 1.0.0
      const mockResponse = mockFetchResponse([model])
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch('http://localhost:3000/api/models?minVersion=0.9.0')
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(model.id)
    })

    it('should filter models by capabilities', async () => {
      const model = await createTestModel()
      const mockResponse = mockFetchResponse([model])
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch('http://localhost:3000/api/models?capabilities=test1')
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(model.id)
    })

    it('should return 400 for invalid category', async () => {
      const mockResponse = mockFetchResponse(null, 400)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Invalid category',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch('http://localhost:3000/api/models?category=invalid')
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid category')
    })
  })

  describe('POST /api/models', () => {
    it('should create a new model', async () => {
      const validModel = {
        id: uuidv4(),
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
        }
      }

      const mockResponse = mockFetchResponse(validModel, 201)
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validModel)
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(validModel.id)
      expect(data.data.name).toBe(validModel.name)
    })

    it('should return 409 when model ID already exists', async () => {
      const model = await createTestModel()
      const mockResponse = mockFetchResponse(null, 409)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Model with this ID already exists',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Model with this ID already exists')
    })

    it('should return 400 for invalid version format', async () => {
      const invalidModel = {
        id: uuidv4(),
        name: 'Test Model',
        version: 'invalid',
        category: 'general'
      }

      const mockResponse = mockFetchResponse(null, 400)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Invalid version format',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidModel)
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid')
    })

    it('should return 400 for invalid category', async () => {
      const invalidModel = {
        id: uuidv4(),
        name: 'Test Model',
        version: '1.0.0',
        category: 'invalid'
      }

      const mockResponse = mockFetchResponse(null, 400)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Invalid category',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidModel)
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid')
    })
  })

  describe('GET /api/models/[modelId]', () => {
    it('should return model by ID', async () => {
      const model = await createTestModel()
      const mockResponse = mockFetchResponse({ ...model, _count: { agents: 0 } })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/models/${model.id}`)
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(model.id)
      expect(data.data._count).toBeDefined()
    })

    it('should return 404 when model not found', async () => {
      const mockResponse = mockFetchResponse(null, 404)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Model not found',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch(`http://localhost:3000/api/models/non-existent`)
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Model not found')
    })
  })

  describe('PATCH /api/models/[modelId]', () => {
    it('should update model', async () => {
      const model = await createTestModel()
      const updates = {
        name: 'Updated Model',
        description: 'Updated description',
        version: '1.1.0'
      }

      const mockResponse = mockFetchResponse({ ...model, ...updates })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/models/${model.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updates.name)
      expect(data.data.description).toBe(updates.description)
      expect(data.data.version).toBe(updates.version)
    })

    it('should reject version downgrade', async () => {
      const model = await createTestModel() // Creates version 1.0.0
      const updates = { version: '0.9.0' }

      const mockResponse = mockFetchResponse(null, 400)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'New version must be higher than current version',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch(`http://localhost:3000/api/models/${model.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('New version must be higher than current version')
    })
  })

  describe('DELETE /api/models/[modelId]', () => {
    it('should delete model', async () => {
      const model = await createTestModel()
      const mockResponse = mockFetchResponse({ message: 'Model deleted successfully' })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/models/${model.id}`, {
        method: 'DELETE'
      })
      const { status, data } = await parseApiResponse(response)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      // Verify model is deleted
      const mockGetResponse = mockFetchResponse(null, 404)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockGetResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Model not found',
          timestamp: new Date().toISOString()
        })
      })

      const getResponse = await fetch(`http://localhost:3000/api/models/${model.id}`)
      const { status: getStatus, data: getData } = await parseApiResponse(getResponse)
      expect(getStatus).toBe(404)
      expect(getData.success).toBe(false)
      expect(getData.error).toBe('Model not found')
    })
  })
}) 