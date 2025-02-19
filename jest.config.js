const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: [
    process.env.TEST_TYPE === 'backend'
      ? '<rootDir>/src/__tests__/setup/jest.backend.setup.ts'
      : '<rootDir>/src/__tests__/setup/jest.frontend.setup.ts'
  ],
  testEnvironment: process.env.TEST_TYPE === 'backend' ? 'node' : 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.{js,jsx,ts,tsx}'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill).+\\.js$'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  modulePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 