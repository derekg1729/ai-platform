import {
  setupTestDatabase,
  createTestUser,
  createTestModel,
  createTestAgent,
  testPrisma,
} from '../../setup/backend-test-utils'

describe('Database Models', () => {
  beforeEach(async () => {
    await setupTestDatabase()
  })

  describe('User Model', () => {
    it('should create a user successfully', async () => {
      const user = await createTestUser()
      expect(user.email).toMatch(/^test-.*@example\.com$/)
      expect(user.name).toBe('Test User')
      expect(user.id).toBeDefined()
    })
  })

  describe('Model', () => {
    it('should create a model successfully', async () => {
      const model = await createTestModel()
      expect(model.name).toBe('Test Model')
      expect(model.capabilities).toEqual(['test1', 'test2'])
      expect(model.apiSpec).toEqual({
        input: { type: 'string' },
        output: { type: 'string' },
      })
      expect(model.stats).toEqual({
        rating: 5,
        reviews: 0,
        deployments: 0
      })
    })
  })

  describe('Agent', () => {
    it('should create an agent with proper relations', async () => {
      const user = await createTestUser()
      const model = await createTestModel()
      const agent = await createTestAgent(user.id, model.id)

      const agentWithRelations = await testPrisma.agent.findUnique({
        where: { id: agent.id },
        include: {
          user: true,
          model: true,
        },
      })

      expect(agentWithRelations).toBeDefined()
      expect(agentWithRelations?.user.id).toBe(user.id)
      expect(agentWithRelations?.model.id).toBe(model.id)
      expect(agentWithRelations?.status).toBe('initializing')
      expect(agentWithRelations?.config).toEqual({
        settings: { temperature: 0.7 }
      })
      expect(agentWithRelations?.metrics).toEqual({
        lastActive: expect.any(String),
        uptime: 0,
        requestsProcessed: 0,
        averageResponseTime: 0
      })
    })
  })
}) 