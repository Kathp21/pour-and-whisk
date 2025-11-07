import { useState } from 'react'

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Menu', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full px-6 py-4 md:px-12 bg-background-dark shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-serif font-bold text-text-light">
          Pour & Whisk
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-text-light hover:text-white font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {/* Desktop Cart Icon */}
          <button className="p-2 text-text-light hover:text-white focus:outline-none transition-colors" aria-label="Shopping cart">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          {/* Desktop Order Now Button */}
          <button className="bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-2 px-6 rounded-lg text-sm transition-colors duration-200">
            Order Now
          </button>
        </div>

        {/* Mobile Cart and Burger */}
        <div className="md:hidden flex items-center">
          {/* Mobile Cart Icon */}
          <button className="p-2 text-text-light focus:outline-none" aria-label="Shopping cart">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          {/* Mobile Burger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-text-light focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-text-light transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-text-light transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-text-light transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-text-light hover:bg-white/10 rounded-md font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {/* Mobile Order Now Button */}
          <div className="pt-2 px-2">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-button-primary hover:bg-button-primary/90 text-text-light font-semibold py-3 px-6 rounded-lg text-base transition-colors duration-200"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

