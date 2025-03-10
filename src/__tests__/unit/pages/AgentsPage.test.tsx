import { render, screen, waitFor, within } from '@/__tests__/setup/test-utils'
import AgentsPage from '@/app/(routes)/agents/page'
import { listUserAgents } from '@/lib/api/agents'
import { Agent } from '@/types/api'

// Mock the API module
jest.mock('@/lib/api/agents', () => ({
  listUserAgents: jest.fn()
}))

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Research Assistant',
    status: 'running' as const,
    modelId: 'gpt-4',
    userId: 'user-123',
    createdAt: '2024-02-18T10:00:00Z',
    updatedAt: '2024-02-18T10:00:00Z',
    metrics: {
      lastActive: '2 hours ago',
      uptime: 99.9,
      requestsProcessed: 1500,
      averageResponseTime: 0.8
    },
    config: {
      apiKeys: {
        'OpenAI': 'sk-xxx',
        'Pinecone': 'pine-xxx'
      },
      settings: {
        temperature: 0.7,
        maxTokens: 2000
      }
    }
  },
  {
    id: '2',
    name: 'Customer Support Bot',
    status: 'stopped' as const,
    modelId: 'gpt-3.5-turbo',
    userId: 'user-123',
    createdAt: '2024-02-18T09:00:00Z',
    updatedAt: '2024-02-18T09:00:00Z',
    metrics: {
      lastActive: '1 day ago',
      uptime: 95.5,
      requestsProcessed: 800,
      averageResponseTime: 1.2
    },
    config: {
      apiKeys: {},
      settings: {}
    }
  }
]

describe('AgentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    jest.mocked(listUserAgents).mockImplementation(() => new Promise(() => {}))
    render(<AgentsPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error message when API fails', async () => {
    const errorMessage = 'Failed to load agents'
    jest.mocked(listUserAgents).mockResolvedValueOnce({ 
      success: false, 
      error: { code: 'FETCH_ERROR', message: errorMessage } 
    })

    render(<AgentsPage />)

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })
  })

  it('renders empty state correctly', async () => {
    jest.mocked(listUserAgents).mockResolvedValueOnce({ 
      success: true, 
      data: { 
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    const { user } = render(<AgentsPage />)

    await waitFor(() => {
      expect(screen.getByText('No agents deployed yet')).toBeInTheDocument()
      expect(screen.getByText('Deploy your first AI agent from the marketplace to get started')).toBeInTheDocument()
    })

    // Test navigation to marketplace
    const browseButton = screen.getByRole('button', { name: 'Browse Models' })
    await user.click(browseButton)
  })

  it('renders agents list successfully', async () => {
    jest.mocked(listUserAgents).mockResolvedValueOnce({ 
      success: true, 
      data: { 
        items: mockAgents,
        total: 2,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    render(<AgentsPage />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check header content
    expect(screen.getByRole('heading', { name: 'My Agents' })).toBeInTheDocument()
    expect(screen.getByText('Manage your deployed AI agents')).toBeInTheDocument()
    
    // Check Deploy New Agent button
    const deployButton = screen.getByRole('button', { name: 'Deploy New Agent' })
    expect(deployButton).toBeInTheDocument()

    // Check agent cards
    mockAgents.forEach(agent => {
      const agentHeading = screen.getByRole('heading', { name: agent.name })
      const agentCard = agentHeading.closest('div.bg-gray-900\\/50')
      expect(agentCard).toBeInTheDocument()

      // Check status indicator
      const statusContainer = within(agentCard as HTMLElement)
        .getByTestId('status-container')
      expect(statusContainer).toHaveClass('flex', 'items-center', 'gap-2', 'text-sm', 'text-gray-400')
      expect(statusContainer.textContent).toContain(agent.status === 'running' ? 'Active' : 'Inactive')
      expect(statusContainer.textContent).toContain(`Last active ${agent.metrics.lastActive}`)

      // Check status dot
      const statusDot = within(statusContainer).getByTestId('status-dot')
      expect(statusDot).toHaveClass('w-2', 'h-2', 'rounded-full', agent.status === 'running' ? 'bg-green-500' : 'bg-red-500')

      // Check metrics
      expect(screen.getByText(`${agent.metrics.uptime}%`)).toBeInTheDocument()
      expect(screen.getByText(agent.metrics.requestsProcessed.toString())).toBeInTheDocument()
      expect(screen.getByText(`${agent.metrics.averageResponseTime}s`)).toBeInTheDocument()

      // Check API keys if present
      if (Object.keys(agent.config.apiKeys).length > 0) {
        Object.entries(agent.config.apiKeys).forEach(([service, key]) => {
          expect(screen.getByText(service)).toBeInTheDocument()
          expect(screen.getByText(key)).toBeInTheDocument()
        })
      }

      // Check Manage button link
      const manageButton = within(agentCard as HTMLElement).getByRole('button', { name: 'Manage' })
      const manageLink = manageButton.closest('a')
      expect(manageLink).toHaveAttribute('href', `/agents/${agent.id}`)
    })
  })

  it('handles navigation correctly', async () => {
    jest.mocked(listUserAgents).mockResolvedValueOnce({ 
      success: true, 
      data: { 
        items: mockAgents,
        total: 2,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    const { user } = render(<AgentsPage />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Test Deploy New Agent navigation
    const deployButton = screen.getByRole('button', { name: 'Deploy New Agent' })
    await user.click(deployButton)

    // Test Manage button navigation
    mockAgents.forEach(agent => {
      const agentHeading = screen.getByRole('heading', { name: agent.name })
      const agentCard = agentHeading.closest('div.bg-gray-900\\/50')
      const manageButton = within(agentCard as HTMLElement).getByRole('button', { name: 'Manage' })
      const manageLink = manageButton.closest('a')
      expect(manageLink).toHaveAttribute('href', `/agents/${agent.id}`)
    })
  })
}) 