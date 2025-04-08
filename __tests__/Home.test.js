import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../app/page'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Homepage', () => {
  it('renders the hero section with correct content', () => {
    render(<Home />)
    
    // Check main heading
    expect(screen.getByText('Transform Your Business With Expert AI Coaching')).toBeInTheDocument()
    
    // Check subheading
    expect(screen.getByText(/Experience personalized business coaching sessions/)).toBeInTheDocument()
    
    // Check CTA buttons
    expect(screen.getByText('Try Live AI Coach')).toBeInTheDocument()
    expect(screen.getByText('Book Regular Session')).toBeInTheDocument()
  })

  it('renders the features section with all three features', () => {
    render(<Home />)
    
    // Check section heading
    expect(screen.getByText('How Our AI Coaching Works')).toBeInTheDocument()
    
    // Check feature titles
    expect(screen.getByText('Personalized Assessment')).toBeInTheDocument()
    expect(screen.getByText('Live Interactive Sessions')).toBeInTheDocument()
    expect(screen.getByText('Actionable Strategies')).toBeInTheDocument()
  })

  it('renders the testimonials section with all testimonials', () => {
    render(<Home />)
    
    // Check section heading
    expect(screen.getByText('What Our Clients Say')).toBeInTheDocument()
    
    // Check testimonial content
    expect(screen.getByText(/The AI coaching sessions transformed our marketing strategy/)).toBeInTheDocument()
    expect(screen.getByText(/Having access to business expertise 24\/7/)).toBeInTheDocument()
    expect(screen.getByText(/The personalized guidance helped me navigate/)).toBeInTheDocument()
    
    // Check testimonial authors
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Michael Chen')).toBeInTheDocument()
    expect(screen.getByText('Jessica Rodriguez')).toBeInTheDocument()
  })

  it('renders the call to action section', () => {
    render(<Home />)
    
    // Check section heading
    expect(screen.getByText('Ready to Transform Your Business?')).toBeInTheDocument()
    
    // Check CTA text
    expect(screen.getByText(/Start your AI coaching journey today/)).toBeInTheDocument()
    
    // Check CTA button
    expect(screen.getByText('Try Live AI Coach Now')).toBeInTheDocument()
  })

  it('includes the Header and Footer components', () => {
    render(<Home />)
    
    // Check for Header content
    expect(screen.getByText('Business Coaching')).toBeInTheDocument()
    
    // Check for Footer content
    expect(screen.getByText(/©/)).toBeInTheDocument()
  })

  it('has working navigation links', () => {
    render(<Home />)
    
    // Check hero section links
    const liveCoachLink = screen.getByText('Try Live AI Coach').closest('a')
    expect(liveCoachLink).toHaveAttribute('href', '/livestream')
    
    const bookSessionLink = screen.getByText('Book Regular Session').closest('a')
    expect(bookSessionLink).toHaveAttribute('href', '/meeting')
    
    // Check CTA section link
    const ctaLink = screen.getByText('Try Live AI Coach Now').closest('a')
    expect(ctaLink).toHaveAttribute('href', '/livestream')
  })
}) 