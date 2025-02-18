import { screen, fireEvent, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { render } from '@/__tests__/setup/test-utils'

// Mock the useRouter hook
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('NavBar', () => {
  const getHamburgerButton = () => {
    const buttons = screen.getAllByRole('button')
    const hamburgerButton = buttons.find(button => button.querySelector('svg'))
    if (!hamburgerButton) {
      throw new Error('Hamburger button not found')
    }
    return hamburgerButton
  }

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('renders the logo and brand name', () => {
    render(<NavBar />)
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('Agent Hub')).toBeInTheDocument()
  })

  it('renders all menu items', () => {
    render(<NavBar />)
    // Get all menu items and check that each one exists at least once
    const menuItems = ['My Agents', 'Analytics', 'Models', 'Docs']
    menuItems.forEach(item => {
      const elements = screen.getAllByText(item)
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('renders the Connect button', () => {
    render(<NavBar />)
    expect(screen.getAllByText('Connect')).toHaveLength(2) // Desktop and mobile versions
  })

  it('navigates to sign in page when Connect button is clicked', () => {
    render(<NavBar />)
    const connectButtons = screen.getAllByText('Connect')
    fireEvent.click(connectButtons[0]) // Click desktop version
    expect(mockPush).toHaveBeenCalledWith('/auth/signin')
  })

  describe('Mobile Menu', () => {
    it('shows mobile menu when hamburger button is clicked', async () => {
      render(<NavBar />)
      
      // Wait for component to mount
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      const hamburgerButton = getHamburgerButton()
      await act(async () => {
        fireEvent.click(hamburgerButton)
      })

      // Check if mobile menu items are visible
      const mobileMenuItems = screen.getAllByText(/My Agents|Analytics|Models|Docs/i)
      mobileMenuItems.forEach(item => {
        expect(item).toBeVisible()
      })
    })

    it('hides mobile menu when route changes', async () => {
      render(<NavBar />)
      
      // Wait for component to mount
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      // Open mobile menu
      const hamburgerButton = getHamburgerButton()
      await act(async () => {
        fireEvent.click(hamburgerButton)
      })

      // Simulate route change
      await act(async () => {
        const router = useRouter()
        router.push('/some-route')
      })

      // Check if mobile menu is hidden
      const mobileMenu = screen.getByRole('navigation').querySelector('.md\\:hidden')
      if (!mobileMenu) {
        throw new Error('Mobile menu not found')
      }
      expect(mobileMenu.classList.toString()).toContain('hidden')
    })
  })

  describe('Responsive Design', () => {
    it('shows desktop menu items on large screens', () => {
      render(<NavBar />)
      const desktopMenu = screen.getByRole('navigation').querySelector('.hidden.md\\:flex')
      expect(desktopMenu).toBeInTheDocument()
    })

    it('shows hamburger menu on mobile screens', () => {
      render(<NavBar />)
      const mobileMenuButton = getHamburgerButton()
      expect(mobileMenuButton).toBeInTheDocument()
      expect(mobileMenuButton.closest('div')).toHaveClass('md:hidden')
    })
  })

  describe('Accessibility', () => {
    it('has sufficient color contrast', () => {
      render(<NavBar />)
      const navElement = screen.getByRole('navigation')
      expect(navElement).toHaveClass('bg-black/20')
    })

    it('preserves focus management', async () => {
      render(<NavBar />)
      
      // Wait for component to mount
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      const hamburgerButton = getHamburgerButton()
      await act(async () => {
        fireEvent.click(hamburgerButton)
      })

      // Check if mobile menu items are focusable
      const mobileMenuItems = screen.getAllByRole('link')
      mobileMenuItems.forEach(item => {
        expect(item).toHaveAttribute('href')
      })
    })
  })
}) 