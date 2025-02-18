import React from 'react'
import { render, screen, waitFor } from '@/__tests__/setup/test-utils'
import AgentsPage from '@/app/(routes)/agents/page'
import { listUserAgents } from '@/lib/api/agents'
import type { Agent } from '@/types/api'

// Mock the API module
jest.mock('@/lib/api/agents', () => ({
  listUserAgents: jest.fn()
}))

const mockAgent1: Agent = {
  id: 'agent-1',
  modelId: 'model-1',
  userId: 'user-1',
  name: 'Test Agent 1',
  status: 'running',
  config: {
    apiKeys: {
      'openai': 'sk-test-key'
    },
    settings: {
      model: 'GPT-4',
      temperature: 0.7
    }
  },
  metrics: {
    uptime: 99.9,
    requestsProcessed: 1000,
    averageResponseTime: 0.5,
    lastActive: '2 hours ago'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const mockAgent2: Agent = {
  id: 'agent-2',
  modelId: 'model-2',
  userId: 'user-1',
  name: 'Test Agent 2',
  status: 'stopped',
  config: {
    apiKeys: {},
    settings: {
      model: 'Claude',
      temperature: 0.5
    }
  },
  metrics: {
    uptime: 95.5,
    requestsProcessed: 500,
    averageResponseTime: 0.8,
    lastActive: '1 day ago'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const mockAgents = [mockAgent1, mockAgent2]

describe('AgentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays loading state initially', () => {
    jest.mocked(listUserAgents).mockImplementation(() => new Promise(() => {}))
    render(<AgentsPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to load agents'
    jest.mocked(listUserAgents).mockResolvedValue({
      success: false,
      error: { code: 'FETCH_ERROR', message: errorMessage }
    })

    render(<AgentsPage />)
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })
  })

  it('displays empty state when no agents are available', async () => {
    jest.mocked(listUserAgents).mockResolvedValue({
      success: true,
      data: { 
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    render(<AgentsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('No agents deployed yet')).toBeInTheDocument()
      expect(screen.getByText('Deploy your first AI agent from the marketplace to get started')).toBeInTheDocument()
      expect(screen.getByText('Browse Models')).toBeInTheDocument()
    })
  })

  it('displays agents when available', async () => {
    jest.mocked(listUserAgents).mockResolvedValue({
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

    await waitFor(() => {
      // Check page title and description
      expect(screen.getByText('My Agents')).toBeInTheDocument()
      expect(screen.getByText('Manage your deployed AI agents')).toBeInTheDocument()

      // Check agent cards
      expect(screen.getByText('Test Agent 1')).toBeInTheDocument()
      expect(screen.getByText('Test Agent 2')).toBeInTheDocument()

      // Check status indicators
      const statusContainers = screen.getAllByTestId('status-container')
      expect(statusContainers[0]).toHaveTextContent('Active')
      expect(statusContainers[1]).toHaveTextContent('Inactive')

      // Check metrics
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
      expect(screen.getByText('0.5s')).toBeInTheDocument()

      // Check API keys section
      expect(screen.getByText('openai')).toBeInTheDocument()
      expect(screen.getByText('sk-test-key')).toBeInTheDocument()

      // Check buttons
      const manageButtons = screen.getAllByText('Manage')
      expect(manageButtons).toHaveLength(2)
      expect(screen.getByText('Deploy New Agent')).toBeInTheDocument()
    })
  })

  it('handles navigation correctly', async () => {
    jest.mocked(listUserAgents).mockResolvedValue({
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

    // Wait for agents to load
    await screen.findByText('Test Agent 1')

    // Test Deploy New Agent navigation
    const deployButton = screen.getByRole('button', { name: 'Deploy New Agent' })
    await user.click(deployButton)

    // Test Manage button navigation
    const manageButtons = screen.getAllByRole('button', { name: 'Manage' })
    expect(manageButtons).toHaveLength(2)
    manageButtons.forEach((button, index) => {
      const link = button.closest('a')
      expect(link).toHaveAttribute('href', `/agents/${mockAgents[index].id}`)
    })
  })

  it('displays error state correctly', async () => {
    jest.mocked(listUserAgents).mockRejectedValue(new Error('Failed to fetch'))

    render(<AgentsPage />)

    await waitFor(() => {
      const errorElement = screen.getByText((content, element) => {
        return element?.textContent === 'Error: An unexpected error occurred'
      })
      expect(errorElement).toBeInTheDocument()
    })
  })
}) 