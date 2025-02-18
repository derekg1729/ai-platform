import React from 'react'
import { render, screen, waitFor, within } from '@/__tests__/setup/test-utils'
import MarketplacePage from '@/app/(routes)/marketplace/page'
import { listModels } from '@/lib/api/agents'

// Mock the API module
jest.mock('@/lib/api/agents', () => ({
  listModels: jest.fn()
}))

const mockModels = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced language model',
    category: 'Language Models',
    version: '1.0.0',
    capabilities: ['Natural language processing', 'Code generation'],
    apiSpec: {
      input: { type: 'string' },
      output: { type: 'string' }
    },
    pricing: {
      type: 'paid' as const,
      amount: 0.03,
      period: 'monthly' as const
    },
    stats: {
      rating: 4.9,
      reviews: 2500,
      deployments: 10000
    }
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Image generation model',
    category: 'Image Generation',
    version: '2.1',
    capabilities: ['Text to image', 'Image to image'],
    apiSpec: {
      input: { type: 'string' },
      output: { type: 'string' }
    },
    pricing: {
      type: 'free' as const,
      amount: 0,
      period: 'yearly' as const
    },
    stats: {
      rating: 4.7,
      reviews: 1800,
      deployments: 8000
    }
  }
]

describe('MarketplacePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    jest.mocked(listModels).mockImplementation(() => new Promise(() => {}))
    render(<MarketplacePage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error message when API fails', async () => {
    const errorMessage = 'Failed to load models'
    jest.mocked(listModels).mockResolvedValueOnce({ 
      success: false, 
      error: { 
        code: 'FETCH_ERROR',
        message: errorMessage 
      } 
    })

    render(<MarketplacePage />)

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })
  })

  it('renders marketplace content successfully', async () => {
    jest.mocked(listModels).mockResolvedValueOnce({ 
      success: true, 
      data: { 
        items: mockModels,
        total: mockModels.length,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    render(<MarketplacePage />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check header content
    expect(screen.getByRole('heading', { name: 'AI Model Marketplace' })).toBeInTheDocument()
    expect(screen.getByText('Deploy powerful AI models as personalized agents')).toBeInTheDocument()
    
    // Check Submit Model button
    expect(screen.getByRole('button', { name: 'Submit Model' })).toBeInTheDocument()

    // Check category filters
    const categoryButtons = screen.getAllByRole('button', { name: /^(All|Language models|Image generation)$/ })
    expect(categoryButtons).toHaveLength(3) // 'all' + unique categories
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Language models' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Image generation' })).toBeInTheDocument()

    // Check model cards
    mockModels.forEach(model => {
      const modelHeading = screen.getByRole('heading', { name: model.name })
      const modelCard = modelHeading.closest('div.bg-gray-900\\/50')
      expect(modelCard).toBeInTheDocument()

      // Check model details
      expect(screen.getByText(model.description)).toBeInTheDocument()
      
      // Check pricing
      if (model.pricing.type === 'free') {
        expect(screen.getByText('Free')).toBeInTheDocument()
      } else {
        expect(screen.getByText(`$${model.pricing.amount}/${model.pricing.period}`)).toBeInTheDocument()
      }

      // Check stats
      expect(screen.getByText(model.stats.rating.toString())).toBeInTheDocument()
      expect(screen.getByText(`(${model.stats.reviews})`)).toBeInTheDocument()
      expect(screen.getByText(`${model.stats.deployments.toLocaleString()} deployments`)).toBeInTheDocument()

      // Check buttons
      const modelCardElement = modelHeading.closest('div.bg-gray-900\\/50') as HTMLElement
      expect(within(modelCardElement).getByRole('button', { name: 'Deploy' })).toBeInTheDocument()
      
      const learnMoreButton = within(modelCardElement).getByRole('button', { name: 'Learn More' })
      expect(learnMoreButton.closest('a')).toHaveAttribute('href', `/models/${model.id}`)
    })
  })

  it('filters models by category', async () => {
    jest.mocked(listModels).mockResolvedValueOnce({ 
      success: true, 
      data: { 
        items: mockModels,
        total: mockModels.length,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    const { user } = render(<MarketplacePage />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Initially all models should be visible
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)

    // Click Language category
    await user.click(screen.getByText('Language models'))

    // Only GPT-4 should be visible
    expect(screen.getByText('GPT-4')).toBeInTheDocument()
    expect(screen.queryByText('Stable Diffusion')).not.toBeInTheDocument()

    // Click Vision category
    await user.click(screen.getByText('Image generation'))

    // Only Stable Diffusion should be visible
    expect(screen.queryByText('GPT-4')).not.toBeInTheDocument()
    expect(screen.getByText('Stable Diffusion')).toBeInTheDocument()

    // Click All category
    await user.click(screen.getByText('All'))

    // All models should be visible again
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('handles navigation correctly', async () => {
    jest.mocked(listModels).mockResolvedValueOnce({ 
      success: true, 
      data: { 
        items: mockModels,
        total: mockModels.length,
        page: 1,
        pageSize: 10,
        hasMore: false
      }
    })

    render(<MarketplacePage />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check Submit Model button opens in new tab
    const submitButton = screen.getByRole('button', { name: 'Submit Model' })
    expect(submitButton.onclick).toBeDefined()

    // Check Learn More links
    const learnMoreButtons = screen.getAllByRole('button', { name: 'Learn More' })
    expect(learnMoreButtons).toHaveLength(mockModels.length)
    
    mockModels.forEach((model, index) => {
      const link = learnMoreButtons[index].closest('a')
      expect(link).toHaveAttribute('href', `/models/${model.id}`)
    })
  })
}) 