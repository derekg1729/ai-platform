import { getAgent, getModel } from '@/lib/api/agents'

describe('Agents API Integration', () => {
  describe('GET /api/agents/:agentId', () => {
    it('should return 404 for non-existent agent', async () => {
      const response = await getAgent('non-existent-id')
      expect(response.success).toBe(false)
      expect(response.error?.code).toBe('NOT_FOUND')
    })
  })

  describe('GET /api/models/:modelId', () => {
    it('should return 404 for non-existent model', async () => {
      const response = await getModel('non-existent-id')
      expect(response.success).toBe(false)
      expect(response.error?.code).toBe('NOT_FOUND')
    })
  })
}) 