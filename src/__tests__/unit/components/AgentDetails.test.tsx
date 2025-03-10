import { screen, waitFor, fireEvent, act } from '@testing-library/react'
import AgentDetails from '@/components/AgentDetails'
import { getAgent, getModel } from '@/lib/api/agents'
import { render } from '@/__tests__/setup/test-utils'
import { agentFixture, modelFixture } from '@/__tests__/fixtures/agents/agent-fixtures'

// Mock the API modules
jest.mock('@/lib/api/agents', () => ({
  getAgent: jest.fn(),
  getModel: jest.fn(),
}))

// Mock child components
jest.mock('@/components/AgentUsageGraph', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-usage-graph">Usage Graph</div>
}))

jest.mock('@/components/AgentFeedback', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-feedback">Feedback Component</div>
}))

jest.mock('@/components/AgentLogs', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-logs">Logs Component</div>
}))

describe('AgentDetails Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('shows loading state initially', async () => {
    // Mock API calls to never resolve during this test
    jest.mocked(getAgent).mockImplementation(() => new Promise(() => {}))
    
    await act(async () => {
      render(<AgentDetails agentId="test-agent-1" />)
    })

    const spinner = screen.getByText('', { 
      selector: 'div.animate-spin.rounded-full.h-8.w-8.border-t-2.border-b-2.border-purple-500'
    })
    expect(spinner).toBeInTheDocument()
  })

  it('displays error message when agent fetch fails', async () => {
    const errorMessage = 'Failed to load agent'
    jest.mocked(getAgent).mockResolvedValueOnce({ 
      success: false, 
      error: { code: 'FETCH_ERROR', message: errorMessage } 
    })

    await act(async () => {
      render(<AgentDetails agentId="test-agent-1" />)
      // Wait for the promise to resolve
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('displays agent details when fetch succeeds', async () => {
    jest.mocked(getAgent).mockResolvedValueOnce({ 
      success: true, 
      data: agentFixture 
    })
    jest.mocked(getModel).mockResolvedValueOnce({ 
      success: true, 
      data: modelFixture 
    })

    await act(async () => {
      render(<AgentDetails agentId="test-agent-1" />)
      // Wait for all promises to resolve
      await Promise.resolve()
    })

    await waitFor(() => {
      // Check basic agent info
      expect(screen.getByText(agentFixture.name)).toBeInTheDocument()
      
      // Check that mock components are rendered
      expect(screen.getByTestId('mock-usage-graph')).toBeInTheDocument()
      expect(screen.getByTestId('mock-feedback')).toBeInTheDocument()
      expect(screen.getByTestId('mock-logs')).toBeInTheDocument()

      // Check status badge
      expect(screen.getByText('Running')).toBeInTheDocument()

      // Check configuration values
      expect(screen.getByText('temperature')).toBeInTheDocument()
      expect(screen.getByText('0.7')).toBeInTheDocument()
      expect(screen.getByText('maxTokens')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
    })
  })

  it('handles model fetch failure gracefully', async () => {
    jest.mocked(getAgent).mockResolvedValueOnce({ 
      success: true, 
      data: agentFixture 
    })
    jest.mocked(getModel).mockRejectedValueOnce(new Error('Failed to load model'))

    await act(async () => {
      render(<AgentDetails agentId="test-agent-1" />)
      // Wait for all promises to resolve
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(screen.getByText('Failed to load model')).toBeInTheDocument()
    })
  })

  it('displays correct status colors', async () => {
    // Test running status
    jest.mocked(getAgent)
      .mockResolvedValueOnce({ 
        success: true, 
        data: { ...agentFixture, status: 'running' }
      })
      .mockResolvedValueOnce({ 
        success: true, 
        data: { ...agentFixture, status: 'stopped' }
      })

    jest.mocked(getModel)
      .mockResolvedValueOnce({ 
        success: true, 
        data: modelFixture 
      })
      .mockResolvedValueOnce({ 
        success: true, 
        data: modelFixture 
      })

    const { rerender } = render(<AgentDetails agentId="test-agent-1" />)

    // Check running status
    await waitFor(() => {
      const runningStatus = screen.getByText('Running')
      expect(runningStatus).toHaveClass('bg-green-500/20')
    })

    // Trigger a refetch by rerendering
    await act(async () => {
      rerender(<AgentDetails agentId="test-agent-1" key="rerender" />)
    })

    // Check stopped status
    await waitFor(() => {
      const stoppedStatus = screen.getByText('Stopped')
      expect(stoppedStatus).toHaveClass('bg-red-500/20')
    })
  })

  it('handles start/stop agent button click', async () => {
    jest.mocked(getAgent).mockResolvedValueOnce({ 
      success: true, 
      data: agentFixture 
    })
    jest.mocked(getModel).mockResolvedValueOnce({ 
      success: true, 
      data: modelFixture 
    })

    render(<AgentDetails agentId="test-agent-1" />)

    // Wait for component to load and button to be available
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      expect(screen.getByText('Stop Agent')).toBeInTheDocument()
    })

    // Find and click the button
    const button = screen.getByText('Stop Agent')
    await act(async () => {
      fireEvent.click(button)
    })
  })

  it('displays API connection statuses correctly', async () => {
    jest.mocked(getAgent).mockResolvedValueOnce({ 
      success: true, 
      data: agentFixture 
    })
    jest.mocked(getModel).mockResolvedValueOnce({ 
      success: true, 
      data: modelFixture 
    })

    render(<AgentDetails agentId="test-agent-1" />)

    await waitFor(() => {
      // Check configured status
      const configuredStatus = screen.getByText('configured')
      expect(configuredStatus).toHaveClass('bg-green-500/20')

      // Check error status
      const errorStatus = screen.getByText('error')
      expect(errorStatus).toHaveClass('bg-red-500/20')

      // Check error message
      expect(screen.getByText('API key expired')).toBeInTheDocument()
    })
  })
}) 