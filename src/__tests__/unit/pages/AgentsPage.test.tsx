import { render, screen, waitFor, within } from '@/__tests__/setup/test-utils'
import AgentsPage from '@/app/(routes)/agents/page'
import { listUserAgents } from '@/lib/api/agents'
import { useRouter } from 'next/navigation'
import { act, fireEvent } from '@testing-library/react'

// Mock the API module
jest.mock('@/lib/api/agents', () => ({
  listUserAgents: jest.fn()
}))

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

const mockAgents = [
  {
    id: '1',
    name: 'Research Assistant',
    status: 'running',
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
      }
    }
  },
  {
    id: '2',
    name: 'Customer Support Bot',
    status: 'stopped',
    metrics: {
      lastActive: '1 day ago',
      uptime: 95.5,
      requestsProcessed: 800,
      averageResponseTime: 1.2
    },
    config: {
      apiKeys: {}
    }
  }
]

describe('AgentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading States', () => {
    it('shows loading state initially', () => {
      jest.mocked(listUserAgents).mockImplementation(() => new Promise(() => {}))
      render(<AgentsPage />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('displays error message when API fails', async () => {
      const errorMessage = 'Failed to load agents'
      jest.mocked(listUserAgents).mockResolvedValueOnce({ 
        success: false, 
        error: { message: errorMessage } 
      })

      render(<AgentsPage />)
      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('renders empty state correctly', async () => {
      jest.mocked(listUserAgents).mockResolvedValueOnce({ 
        success: true, 
        data: { items: [] }
      })

      const { user } = render(<AgentsPage />)

      await waitFor(() => {
        expect(screen.getByText('No agents deployed yet')).toBeInTheDocument()
        expect(screen.getByText('Deploy your first AI agent from the marketplace to get started')).toBeInTheDocument()
      })

      const browseButton = screen.getByRole('button', { name: 'Browse Models' })
      await user.click(browseButton)
      expect(mockPush).toHaveBeenCalledWith('/marketplace')
    })
  })

  describe('Agents List', () => {
    beforeEach(() => {
      jest.mocked(listUserAgents).mockResolvedValueOnce({ 
        success: true, 
        data: { items: mockAgents }
      })
    })

    it('renders header and deploy button', async () => {
      render(<AgentsPage />)
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('heading', { name: 'My Agents' })).toBeInTheDocument()
      expect(screen.getByText('Manage your deployed AI agents')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Deploy New Agent' })).toBeInTheDocument()
    })

    it('renders agent cards with correct status', async () => {
      render(<AgentsPage />)
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      })

      mockAgents.forEach(agent => {
        // Check agent name
        const agentHeading = screen.getByRole('heading', { name: agent.name })
        const agentCard = agentHeading.closest('div.bg-gray-900\\/50')
        expect(agentCard).toBeInTheDocument()

        // Find the status container using a more flexible approach
        const statusContainer = screen.getByText((content, element) => {
          const hasStatus = content.includes(agent.status === 'running' ? 'Active' : 'Inactive')
          const hasLastActive = content.includes(`Last active ${agent.metrics.lastActive}`)
          return hasStatus && hasLastActive
        })
        expect(statusContainer).toHaveClass('text-sm', 'text-gray-400')

        // Find the status indicator dot
        const statusDot = statusContainer.querySelector('span.rounded-full')
        expect(statusDot).toHaveClass(agent.status === 'running' ? 'bg-green-500' : 'bg-gray-500')
      })
    })

    it('renders agent metrics correctly', async () => {
      render(<AgentsPage />)
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      })

      mockAgents.forEach(agent => {
        expect(screen.getByText(`${agent.metrics.uptime}%`)).toBeInTheDocument()
        expect(screen.getByText(agent.metrics.requestsProcessed.toString())).toBeInTheDocument()
        expect(screen.getByText(`${agent.metrics.averageResponseTime}s`)).toBeInTheDocument()
      })
    })

    it('renders API keys when present', async () => {
      render(<AgentsPage />)
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      })

      mockAgents.forEach(agent => {
        if (Object.keys(agent.config.apiKeys).length > 0) {
          Object.entries(agent.config.apiKeys).forEach(([service, key]) => {
            expect(screen.getByText(service)).toBeInTheDocument()
            expect(screen.getByText(key)).toBeInTheDocument()
          })
        }
      })
    })

    it('handles navigation correctly', async () => {
      render(<AgentsPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      })

      // Test Deploy New Agent navigation
      const deployButton = screen.getByRole('button', { name: 'Deploy New Agent' })
      await act(async () => {
        fireEvent.click(deployButton)
      })
      expect(mockPush).toHaveBeenCalledWith('/marketplace')

      // Test Manage button navigation
      const manageLinks = screen.getAllByRole('link')
      mockAgents.forEach((agent, index) => {
        expect(manageLinks[index]).toHaveAttribute('href', `/agents/${agent.id}`)
      })
    })
  })
}) 