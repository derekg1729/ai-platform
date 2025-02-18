import { setupTestDatabase } from '../../setup/backend-test-utils'

describe('Health Check API', () => {
  beforeEach(async () => {
    await setupTestDatabase()
  })

  it('should return healthy status when database is connected', async () => {
    const response = await fetch('http://localhost:3000/api/health')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual(
      expect.objectContaining({
        status: 'healthy',
        database: 'connected',
        timestamp: expect.any(String),
      })
    )
  })

  // We don't test the unhealthy case here because it would require
  // breaking the database connection, which is difficult to do reliably
  // in an integration test. This would be better suited for a unit test
  // with mocked database connections.
}) 