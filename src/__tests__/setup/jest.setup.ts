import '@testing-library/jest-dom'
import { testPrisma } from './backend-test-utils'

// Mock IntersectionObserver for frontend tests
if (process.env.TEST_TYPE === 'frontend') {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockImplementation(() => ({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  }))
  // @ts-ignore
  window.IntersectionObserver = mockIntersectionObserver
}

// Global test setup
beforeAll(async () => {
  // Ensure database is available for backend tests
  if (process.env.TEST_TYPE === 'backend') {
    try {
      await testPrisma.$connect()
    } catch (error) {
      console.error('Failed to connect to test database:', error)
      throw error
    }
  }
})

// Global test teardown
afterAll(async () => {
  // Clean up database connection after backend tests
  if (process.env.TEST_TYPE === 'backend') {
    await testPrisma.$disconnect()
  }
}) 