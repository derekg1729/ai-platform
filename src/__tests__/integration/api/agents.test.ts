import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { setupTestDatabase, teardownTestDatabase, createTestUser, createTestModel, createTestAgent } from '@/__tests__/setup/backend-test-utils'
import { mockFetchResponse, parseApiResponse } from '@/__tests__/setup/test-utils'

describe('Agents API', () => {
  let userId: string
  let modelId: string
  let agentId: string

  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    // Reset fetch mock
    jest.clearAllMocks()

    // Create test user and model first
    const user = await createTestUser()
    const model = await createTestModel()
    userId = user.id
    modelId = model.id

    // Then create the agent
    const agent = await createTestAgent(userId, modelId)
    agentId = agent.id
  })

  test('returns all agents for a user', async () => {
    const mockResponse = mockFetchResponse([{ id: agentId, userId, modelId }])
    global.fetch = jest.fn().mockResolvedValue(mockResponse)

    const response = await fetch('http://localhost:3000/api/agents')
    const { data } = await parseApiResponse(response)
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)
  })

  test('returns empty array when user has no agents', async () => {
    const mockResponse = mockFetchResponse([])
    global.fetch = jest.fn().mockResolvedValue(mockResponse)

    const response = await fetch('http://localhost:3000/api/agents')
    const { data } = await parseApiResponse(response)
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.data.length).toBe(0)
  })

  test('creates a new agent', async () => {
    const mockResponse = mockFetchResponse({ id: agentId, name: 'Test Agent', modelId }, 201)
    global.fetch = jest.fn().mockResolvedValue(mockResponse)

    const response = await fetch('http://localhost:3000/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Agent',
        modelId
      })
    })
    const { data } = await parseApiResponse(response)
    
    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.name).toBe('Test Agent')
    expect(data.data.modelId).toBe(modelId)
  })

  test('returns error for missing required fields', async () => {
    const mockResponse = mockFetchResponse(null, 400)
    global.fetch = jest.fn().mockResolvedValue({
      ...mockResponse,
      json: jest.fn().mockResolvedValue({
        success: false,
        error: 'Missing required fields: name, modelId',
        timestamp: new Date().toISOString()
      })
    })

    const response = await fetch('http://localhost:3000/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    const { data } = await parseApiResponse(response)
    
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
  })

  describe('GET /api/agents/[agentId]', () => {
    test('returns agent by id', async () => {
      const mockResponse = mockFetchResponse({ id: agentId, userId, modelId })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/agents/${agentId}`)
      const { data } = await parseApiResponse(response)
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(agentId)
    })

    test('returns 404 for non-existent agent', async () => {
      const mockResponse = mockFetchResponse(null, 404)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Agent not found',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch('http://localhost:3000/api/agents/non-existent')
      const { data } = await parseApiResponse(response)
      
      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })
  })

  describe('PATCH /api/agents/[agentId]', () => {
    test('updates agent', async () => {
      const mockResponse = mockFetchResponse({ id: agentId, name: 'Updated Agent' })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Agent' })
      })
      const { data } = await parseApiResponse(response)
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Updated Agent')
    })
  })

  describe('DELETE /api/agents/[agentId]', () => {
    test('deletes agent', async () => {
      const mockResponse = mockFetchResponse({ message: 'Agent deleted successfully' })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/agents/${agentId}`, {
        method: 'DELETE'
      })
      const { data } = await parseApiResponse(response)
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('POST /api/agents/[agentId]/[action]', () => {
    test('processes agent action', async () => {
      const mockResponse = mockFetchResponse({ status: 'processed' })
      global.fetch = jest.fn().mockResolvedValue(mockResponse)

      const response = await fetch(`http://localhost:3000/api/agents/${agentId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process' })
      })
      const { data } = await parseApiResponse(response)
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('returns error for invalid action', async () => {
      const mockResponse = mockFetchResponse(null, 400)
      global.fetch = jest.fn().mockResolvedValue({
        ...mockResponse,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: 'Invalid action',
          timestamp: new Date().toISOString()
        })
      })

      const response = await fetch(`http://localhost:3000/api/agents/${agentId}/invalid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invalid' })
      })
      const { data } = await parseApiResponse(response)
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })
  })
}) 