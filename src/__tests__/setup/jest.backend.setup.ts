import { testPrisma, teardownTestDatabase, setupTestDatabase } from './backend-test-utils'

// Mock fetch and related globals for tests
const mockFetchResponse = {
  json: jest.fn().mockImplementation(() => Promise.resolve({})),
  text: jest.fn(),
  blob: jest.fn(),
  arrayBuffer: jest.fn(),
  formData: jest.fn(),
  clone: jest.fn(),
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: new Map(),
}

global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse)) as any
global.Headers = jest.fn(() => new Map()) as any
global.Request = jest.fn() as any
global.Response = jest.fn(() => mockFetchResponse) as any

// Mock TextEncoder/TextDecoder
class MockTextEncoder {
  encode(input: string): Uint8Array {
    return new Uint8Array(Buffer.from(input))
  }
}

class MockTextDecoder {
  decode(input?: BufferSource): string {
    if (!input) return ''
    return Buffer.from(input as ArrayBuffer).toString()
  }
}

global.TextEncoder = MockTextEncoder as any
global.TextDecoder = MockTextDecoder as any

// Mock browser APIs
global.navigator = {
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
} as any

global.window = {
  navigator: global.navigator,
  location: {
    href: 'http://localhost:3000',
  },
} as any

// Helper function to parse API responses
export async function parseApiResponse(response: Response) {
  const data = await response.json()
  return {
    status: response.status,
    data: {
      success: response.ok,
      ...data
    }
  }
}

// Global test setup
beforeAll(async () => {
  try {
    await setupTestDatabase()
  } catch (error) {
    console.error('Failed to setup test database:', error)
    throw error
  }
})

// Setup before each test
beforeEach(async () => {
  try {
    await setupTestDatabase()
  } catch (error) {
    console.error('Failed to setup test database:', error)
    throw error
  }
})

// Global test teardown
afterAll(async () => {
  try {
    await teardownTestDatabase()
  } catch (error) {
    console.error('Failed to teardown test database:', error)
    throw error
  }
}) 