import { setupTestDatabase, createTestModel } from '../../setup/backend-test-utils'
import { v4 as uuidv4 } from 'uuid'

describe('Models API', () => {
  beforeEach(async () => {
    await setupTestDatabase()
  })

  describe('GET /api/models', () => {
    it('should return empty list when no models exist', async () => {
      const response = await fetch('http://localhost:3000/api/models')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should return list of models', async () => {
      const model = await createTestModel()
      const response = await fetch('http://localhost:3000/api/models')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(model.id)
    })

    it('should filter models by category', async () => {
      await createTestModel() // Creates a 'test' category model
      const response = await fetch('http://localhost:3000/api/models?category=chat')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(0) // No chat models
    })

    it('should filter models by minimum version', async () => {
      const model = await createTestModel() // Creates version 1.0.0
      const response = await fetch('http://localhost:3000/api/models?minVersion=0.9.0')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(model.id)
    })

    it('should filter models by capabilities', async () => {
      const model = await createTestModel() // Has capabilities ['test1', 'test2']
      const response = await fetch('http://localhost:3000/api/models?capabilities=test1')
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(model.id)
    })

    it('should return 400 for invalid category', async () => {
      const response = await fetch('http://localhost:3000/api/models?category=invalid')
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid category')
    })
  })

  describe('POST /api/models', () => {
    const modelId = `test-model-${uuidv4()}`
    const validModel = {
      id: modelId,
      name: 'Test Model 2',
      description: 'Another test model',
      version: '1.0.0',
      category: 'chat',
      capabilities: ['test1', 'test2'],
      apiSpec: {
        input: { type: 'string' },
        output: { type: 'string' },
      },
      pricing: { type: 'free' },
      stats: {
        rating: 4.5,
        reviews: 0,
        deployments: 0,
      },
    }

    it('should create a new model', async () => {
      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validModel),
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(validModel.id)
      expect(data.data.name).toBe(validModel.name)
    })

    it('should return 409 when model ID already exists', async () => {
      const existingModel = await createTestModel()

      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validModel,
          id: existingModel.id,
        }),
      })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Model with this ID already exists')
    })

    it('should return 400 for invalid version format', async () => {
      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validModel,
          version: 'invalid',
        }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid')
    })

    it('should return 400 for invalid category', async () => {
      const response = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validModel,
          category: 'invalid',
        }),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid')
    })
  })

  describe('GET /api/models/[modelId]', () => {
    it('should return model by ID', async () => {
      const model = await createTestModel()
      const response = await fetch(`http://localhost:3000/api/models/${model.id}`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(model.id)
      expect(data.data._count).toBeDefined()
    })

    it('should return 404 when model not found', async () => {
      const response = await fetch('http://localhost:3000/api/models/non-existent')
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Model not found')
    })
  })

  describe('PATCH /api/models/[modelId]', () => {
    it('should update model', async () => {
      const model = await createTestModel()
      const updates = {
        name: 'Updated Model Name',
        description: 'Updated description',
        version: '1.1.0',
      }

      const response = await fetch(`http://localhost:3000/api/models/${model.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updates.name)
      expect(data.data.description).toBe(updates.description)
      expect(data.data.version).toBe(updates.version)
    })

    it('should reject version downgrade', async () => {
      const model = await createTestModel() // Version 1.0.0
      const updates = {
        version: '0.9.0',
      }

      const response = await fetch(`http://localhost:3000/api/models/${model.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('New version must be higher than current version')
    })
  })

  describe('DELETE /api/models/[modelId]', () => {
    it('should delete model', async () => {
      const model = await createTestModel()
      const response = await fetch(`http://localhost:3000/api/models/${model.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Verify model is deleted
      const getResponse = await fetch(`http://localhost:3000/api/models/${model.id}`)
      const getResponseData = await getResponse.json()
      expect(getResponse.status).toBe(404)
      expect(getResponseData.success).toBe(false)
      expect(getResponseData.error).toBe('Model not found')
    })
  })
}) 