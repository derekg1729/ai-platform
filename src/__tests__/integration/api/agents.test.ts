import { setupTestDatabase, createTestUser, createTestModel, createTestAgent } from '../../setup/backend-test-utils'

describe('Agents API', () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>

  beforeEach(async () => {
    await setupTestDatabase()
    testUser = await createTestUser()
  })

  const headers = {
    'Content-Type': 'application/json',
  }

  describe('GET /api/agents', () => {
    it('should return empty list when user has no agents', async () => {
      const response = await fetch('http://localhost:3000/api/agents', {
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should return list of user agents', async () => {
      const model = await createTestModel()
      const agent = await createTestAgent(testUser.id, model.id)

      const response = await fetch('http://localhost:3000/api/agents', {
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe(agent.id)
      expect(data.data[0].model).toBeDefined()
    })

    it('should return 401 when user ID is missing', async () => {
      const response = await fetch('http://localhost:3000/api/agents')
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('User ID is required')
    })
  })

  describe('POST /api/agents', () => {
    it('should create a new agent', async () => {
      const model = await createTestModel()
      const newAgent = {
        name: 'New Test Agent',
        modelId: model.id,
        config: { settings: { temperature: 0.7 } },
      }

      const response = await fetch('http://localhost:3000/api/agents', {
        method: 'POST',
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
        body: JSON.stringify(newAgent),
      })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(newAgent.name)
      expect(data.data.modelId).toBe(model.id)
      expect(data.data.status).toBe('initializing')
    })

    it('should return 404 when model does not exist', async () => {
      const newAgent = {
        name: 'New Test Agent',
        modelId: 'non-existent-model',
        config: { settings: { temperature: 0.7 } },
      }

      const response = await fetch('http://localhost:3000/api/agents', {
        method: 'POST',
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
        body: JSON.stringify(newAgent),
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Model not found')
    })
  })

  describe('GET /api/agents/[agentId]', () => {
    it('should return agent by ID', async () => {
      const model = await createTestModel()
      const agent = await createTestAgent(testUser.id, model.id)

      const response = await fetch(`http://localhost:3000/api/agents/${agent.id}`, {
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(agent.id)
      expect(data.data.model).toBeDefined()
    })

    it('should return 403 when accessing another user\'s agent', async () => {
      const otherUser = await createTestUser()
      const model = await createTestModel()
      const agent = await createTestAgent(otherUser.id, model.id)

      const response = await fetch(`http://localhost:3000/api/agents/${agent.id}`, {
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
      })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Unauthorized access to agent')
    })
  })

  describe('PATCH /api/agents/[agentId]', () => {
    it('should update agent', async () => {
      const model = await createTestModel()
      const agent = await createTestAgent(testUser.id, model.id)

      const updates = {
        name: 'Updated Agent Name',
        status: 'running',
        config: { settings: { temperature: 0.8 } },
      }

      const response = await fetch(`http://localhost:3000/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
        body: JSON.stringify(updates),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updates.name)
      expect(data.data.status).toBe(updates.status)
      expect(data.data.config).toEqual(updates.config)
    })
  })

  describe('DELETE /api/agents/[agentId]', () => {
    it('should delete agent', async () => {
      const model = await createTestModel()
      const agent = await createTestAgent(testUser.id, model.id)

      const response = await fetch(`http://localhost:3000/api/agents/${agent.id}`, {
        method: 'DELETE',
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Verify agent is deleted
      const getResponse = await fetch(`http://localhost:3000/api/agents/${agent.id}`, {
        headers: {
          ...headers,
          'x-user-id': testUser.id,
        },
      })
      expect(getResponse.status).toBe(404)
    })
  })
}) 