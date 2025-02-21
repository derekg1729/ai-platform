const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: process.env.TEST_TYPE === 'frontend' 
    ? ['<rootDir>/src/__tests__/setup/jest.setup.ts']
    : ['<rootDir>/src/__tests__/setup/jest.db.setup.ts'],
  testEnvironment: process.env.TEST_TYPE === 'frontend' ? 'jest-environment-jsdom' : 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: process.env.TEST_TYPE === 'frontend' 
    ? ['<rootDir>/src/__tests__/unit/**/*.test.{js,jsx,ts,tsx}']
    : ['<rootDir>/src/__tests__/db/**/*.test.{js,jsx,ts,tsx}', '<rootDir>/src/__tests__/integration/**/*.test.{js,jsx,ts,tsx}'],
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
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 