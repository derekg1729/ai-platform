import React from 'react'
import { render as rtlRender, RenderOptions, screen, waitFor, within, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import userEvent from '@testing-library/user-event'

// Re-export specific items from testing-library
export { screen, waitFor, within, fireEvent }

// Helper function to parse API responses
export async function parseApiResponse(response: Response) {
  const responseData = await response.json()
  return {
    status: response.status,
    data: responseData // API returns { success, data, error, timestamp }
  }
}

// Mock fetch response for testing
export function mockFetchResponse(data: any, status: number = 200) {
  const response = {
    success: status >= 200 && status < 300,
    data,
    timestamp: new Date().toISOString(),
  }

  return {
    json: jest.fn().mockResolvedValue(response),
    status,
    ok: status >= 200 && status < 300,
  }
}

// Create a custom router for testing
const createRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
})

// Providers wrapper for testing
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterContext.Provider value={createRouter()}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </AppRouterContext.Provider>
  )
}

// Custom render for frontend tests
export const render = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  if (process.env.TEST_TYPE !== 'frontend') {
    throw new Error('render() is only available for frontend tests')
  }
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { wrapper: Providers, ...options }),
  }
} 