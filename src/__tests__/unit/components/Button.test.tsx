import React from 'react'
import { render, screen } from '../../../__tests__/setup/test-utils'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: /click me/i }))
      .toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const { user } = render(
      <Button onClick={handleClick}>Click me</Button>
    )

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', async () => {
    const handleClick = jest.fn()
    const { user } = render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    )

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  it('renders with variant styles', () => {
    render(<Button variant="secondary">Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('bg-secondary')
  })
}) 