import { render as rtlRender, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const createMockRouter = (options = {}) => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  ...options
})

// Add any providers here
function Providers({ children }: { children: React.ReactNode }) {
  const mockRouter = createMockRouter()

  return (
    <AppRouterContext.Provider value={mockRouter}>
      {children}
    </AppRouterContext.Provider>
  )
}

function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return {
    ...rtlRender(ui, { wrapper: Providers, ...options }),
    // Return userEvent instance for better interaction testing
    user: userEvent.setup()
  }
}

// Re-export everything
export * from '@testing-library/react'
export { render, userEvent } 