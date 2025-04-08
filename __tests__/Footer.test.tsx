import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from '../components/Footer'

describe('Footer Component', () => {
  it('renders the copyright text with current year', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(`© ${currentYear} Business Coaching. All rights reserved.`)
    expect(copyrightText).toBeInTheDocument()
  })

  it('renders with correct styling classes', () => {
    render(<Footer />)
    
    // Check if footer has the correct background color class
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('bg-gray-800')
    expect(footer).toHaveClass('text-white')
  })
}) 