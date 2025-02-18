import { render, screen } from '@/__tests__/setup/test-utils'
import AnalyticsPage from '@/app/(routes)/analytics/page'

describe('AnalyticsPage', () => {
  it('renders analytics dashboard correctly', () => {
    render(<AnalyticsPage />)

    // Check header content
    expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument()

    // Check summary cards
    const summaryCards = screen.getAllByText(/Total Agents|API Calls|Avg Response Time/)
    expect(summaryCards).toHaveLength(3)

    // Check metric values
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('8,392')).toBeInTheDocument()
    expect(screen.getByText('1.2s')).toBeInTheDocument()

    // Check chart sections
    expect(screen.getByRole('heading', { name: 'API Usage Over Time' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Agent Performance' })).toBeInTheDocument()

    // Check chart placeholders
    const chartPlaceholders = screen.getAllByText('Chart Placeholder')
    expect(chartPlaceholders).toHaveLength(2)
  })

  it('applies correct styling to metrics', () => {
    render(<AnalyticsPage />)

    // Check positive metrics (green text)
    const positiveMetrics = screen.getAllByText(/↑/)
    positiveMetrics.forEach(metric => {
      expect(metric).toHaveClass('text-green-400')
    })

    // Check negative metrics (red text)
    const negativeMetrics = screen.getAllByText(/↓/)
    negativeMetrics.forEach(metric => {
      expect(metric).toHaveClass('text-red-400')
    })
  })

  it('has responsive layout', () => {
    render(<AnalyticsPage />)

    // Check container
    const container = screen.getByRole('heading', { name: 'Analytics' }).closest('div.container')
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-4')

    // Check summary cards grid
    const summaryGrid = screen.getByText('Total Agents').closest('div.grid')
    expect(summaryGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-6')

    // Check charts grid
    const chartsGrid = screen.getAllByText('Chart Placeholder')[0].closest('div.grid')
    expect(chartsGrid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6')
  })
}) 