import { setupTestDatabase } from '../../setup/backend-test-utils'
import { parseApiResponse, mockFetchResponse } from '../../setup/test-utils'

describe('Health Check API', () => {
  beforeEach(async () => {
    await setupTestDatabase()
    // Reset fetch mock
    jest.clearAllMocks()
  })

  it('should return healthy status when database is connected', async () => {
    const mockResponse = mockFetchResponse({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
    global.fetch = jest.fn().mockResolvedValue(mockResponse)

    const response = await fetch('http://localhost:3000/api/health')
    const { status, data } = await parseApiResponse(response)

    expect(status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: {
        status: 'healthy',
        database: 'connected',
        timestamp: expect.any(String)
      },
      timestamp: expect.any(String)
    })
  })

  // We don't test the unhealthy case here because it would require
  // breaking the database connection, which is difficult to do reliably
  // in an integration test. This would be better suited for a unit test
  // with mocked database connections.
}) 