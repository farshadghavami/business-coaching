import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '../components/Header'

describe('Header Component', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />)
    
    // Check if logo text is present
    expect(screen.getByText('Business Coaching')).toBeInTheDocument()
    
    // Check if all navigation links are present
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Live Coach')).toBeInTheDocument()
    expect(screen.getByText('Sessions')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Header />)
    
    // Mobile menu should be hidden initially
    const mobileMenu = screen.getByRole('button')
    expect(mobileMenu).toBeInTheDocument()
    
    // Click the hamburger button
    fireEvent.click(mobileMenu)
    
    // Check if mobile menu links are visible
    const mobileLinks = screen.getAllByRole('link')
    expect(mobileLinks).toHaveLength(9) // 4 nav links in desktop + 4 nav links in mobile + 1 logo link
  })
}) 