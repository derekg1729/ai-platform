import { render as rtlRender, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Add any providers here
function Providers({ children }: { children: React.ReactNode }) {
  return (
    // We can add providers as needed
    <>{children}</>
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