import React from 'react'
import { render, screen } from '../../../__tests__/setup/test-utils'
import DocsPage from '@/app/(routes)/docs/page'

// Define mocks before component definitions
jest.mock('@/content/docs/index.mdx', () => {
  const IntroComponent = () => <div>Introduction Content</div>
  IntroComponent.displayName = 'IntroMDX'
  return IntroComponent
})

jest.mock('@/content/docs/core-concepts/index.mdx', () => {
  const CoreConceptsComponent = () => <div>Core Concepts Content</div>
  CoreConceptsComponent.displayName = 'CoreConceptsMDX'
  return CoreConceptsComponent
})

jest.mock('@/content/docs/api-reference/index.mdx', () => {
  const ApiReferenceComponent = () => <div>API Reference Content</div>
  ApiReferenceComponent.displayName = 'ApiReferenceMDX'
  return ApiReferenceComponent
})

jest.mock('@/content/docs/core-concepts/testing.mdx', () => {
  const TestingComponent = () => <div>Testing Content</div>
  TestingComponent.displayName = 'TestingMDX'
  return TestingComponent
})

const tabs = [
  {
    name: 'Introduction',
    content: 'Introduction Content',
  },
  {
    name: 'Core Concepts',
    content: 'Core Concepts Content',
  },
  {
    name: 'API Reference',
    content: 'API Reference Content',
  },
  {
    name: 'Testing',
    content: 'Testing Content',
  },
]

describe('DocsPage', () => {
  it('renders documentation page correctly', () => {
    render(<DocsPage />)

    // Check header
    expect(screen.getByRole('heading', { name: 'Documentation' })).toBeInTheDocument()

    // Check all tab triggers are present
    const expectedTabs = ['Introduction', 'Core Concepts', 'API Reference', 'Testing']
    expectedTabs.forEach(tab => {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument()
    })
  })

  it('shows Introduction content by default', () => {
    render(<DocsPage />)

    // Check Introduction tab is selected
    const introTab = screen.getByRole('tab', { name: 'Introduction' })
    expect(introTab).toHaveAttribute('data-state', 'active')

    // Check Introduction content is visible
    expect(screen.getByText('Introduction Content')).toBeInTheDocument()
  })

  it('renders documentation tabs correctly', () => {
    render(<DocsPage />)

    // Check if all tabs are rendered
    tabs.forEach(tab => {
      expect(screen.getByRole('tab', { name: tab.name })).toBeInTheDocument()
    })

    // Check if first tab content is visible by default
    expect(screen.getByText('Introduction Content')).toBeInTheDocument()
  })

  it('switches content when tabs are clicked', async () => {
    const { user } = render(<DocsPage />)

    // Test clicking each tab
    for (const tab of tabs) {
      const tabElement = screen.getByRole('tab', { name: tab.name })
      await user.click(tabElement)

      // Check tab is active
      expect(tabElement).toHaveAttribute('data-state', 'active')

      // Check content is visible
      expect(screen.getByText(tab.content)).toBeInTheDocument()
    }
  })

  it('applies correct styling to active tab', async () => {
    const { user } = render(<DocsPage />)

    // Click a tab
    const tab = screen.getByRole('tab', { name: 'Core Concepts' })
    await user.click(tab)

    // Check active tab styling
    expect(tab).toHaveClass('data-[state=active]:bg-purple-500', 'data-[state=active]:text-white')
  })

  it('has responsive layout', () => {
    render(<DocsPage />)

    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-lg')

    const tabPanel = screen.getByRole('tabpanel')
    expect(tabPanel).toHaveClass('mt-2')
  })
}) 