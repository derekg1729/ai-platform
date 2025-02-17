import { render, screen, waitFor, within } from '@/__tests__/setup/test-utils'
import MarketplacePage from '@/app/(routes)/marketplace/page'
import { listModels } from '@/lib/api/agents'

// Mock the API module
jest.mock('@/lib/api/agents', () => ({
  listModels: jest.fn()
}))

const mockModels = [
  {
    id: '1',
    name: 'GPT-4',
    description: 'Advanced language model',
    category: 'Language',
    version: '1.0',
    capabilities: ['Text Generation', 'Translation'],
    pricing: { type: 'paid', amount: 10, period: 'month' },
    stats: {
      rating: 4.8,
      reviews: 120,
      deployments: 1500
    }
  },
  {
    id: '2',
    name: 'DALL-E',
    description: 'Image generation model',
    category: 'Vision',
    capabilities: ['Image Generation'],
    pricing: { type: 'free' },
    stats: {
      rating: 4.5,
      reviews: 80,
      deployments: 1000
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
      error: { message: errorMessage } 
    })

    render(<MarketplacePage />)

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })
  })

  it('renders marketplace content successfully', async () => {
    jest.mocked(listModels).mockResolvedValueOnce({ 
      success: true, 
      data: { items: mockModels }
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
    const categoryButtons = screen.getAllByRole('button', { name: /^(All|Language|Vision)$/ })
    expect(categoryButtons).toHaveLength(3) // 'all' + unique categories
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vision' })).toBeInTheDocument()

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
      data: { items: mockModels }
    })

    const { user } = render(<MarketplacePage />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Initially all models should be visible
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)

    // Click Language category
    await user.click(screen.getByText('Language'))

    // Only GPT-4 should be visible
    expect(screen.getByText('GPT-4')).toBeInTheDocument()
    expect(screen.queryByText('DALL-E')).not.toBeInTheDocument()

    // Click Vision category
    await user.click(screen.getByText('Vision'))

    // Only DALL-E should be visible
    expect(screen.queryByText('GPT-4')).not.toBeInTheDocument()
    expect(screen.getByText('DALL-E')).toBeInTheDocument()

    // Click All category
    await user.click(screen.getByText('All'))

    // All models should be visible again
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
  })

  it('handles navigation correctly', async () => {
    jest.mocked(listModels).mockResolvedValueOnce({ 
      success: true, 
      data: { items: mockModels }
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