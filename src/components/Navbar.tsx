import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [shoppingListCount, setShoppingListCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const updateShoppingListCount = () => {
      const list = JSON.parse(localStorage.getItem('shopping-list') || '[]')
      setShoppingListCount(list.length)
    }

    updateShoppingListCount()
    window.addEventListener('storage', updateShoppingListCount)
    return () => window.removeEventListener('storage', updateShoppingListCount)
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-3xl font-bold text-[#FF6B35]"
          >
            <span>🍳</span>
            <span>RecipeApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-[#FF6B35]' : 'text-[#2D2D2D] hover:text-[#FF6B35]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`font-medium transition-colors ${
                isActive('/search') ? 'text-[#FF6B35]' : 'text-[#2D2D2D] hover:text-[#FF6B35]'
              }`}
            >
              Search
            </Link>
            <Link
              to="/shopping-list"
              className={`flex items-center space-x-1 font-medium transition-colors ${
                isActive('/shopping-list') ? 'text-[#FF6B35]' : 'text-[#2D2D2D] hover:text-[#FF6B35]'
              }`}
            >
              <span>Shopping List</span>
              {shoppingListCount > 0 && (
                <span className="bg-[#FF6B35] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {shoppingListCount}
                </span>
              )}
            </Link>
            <Link
              to="/add"
              className="px-4 py-2 bg-[#FF6B35] text-white font-semibold rounded-full hover:bg-[#FF6B35]/90 transition-colors"
            >
              + Add Recipe
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#2D2D2D] hover:text-[#FF6B35] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-[#FF6B35] bg-[#FFF8F0]' 
                    : 'text-[#2D2D2D] hover:text-[#FF6B35] hover:bg-[#FFF8F0]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/search') 
                    ? 'text-[#FF6B35] bg-[#FFF8F0]' 
                    : 'text-[#2D2D2D] hover:text-[#FF6B35] hover:bg-[#FFF8F0]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/add"
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/add') 
                    ? 'text-[#FF6B35] bg-[#FFF8F0]' 
                    : 'text-[#2D2D2D] hover:text-[#FF6B35] hover:bg-[#FFF8F0]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Add Recipe
              </Link>
              <Link
                to="/shopping-list"
                className={`flex items-center justify-between px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive('/shopping-list') 
                    ? 'text-[#FF6B35] bg-[#FFF8F0]' 
                    : 'text-[#2D2D2D] hover:text-[#FF6B35] hover:bg-[#FFF8F0]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Shopping List</span>
                {shoppingListCount > 0 && (
                  <span className="bg-[#FF6B35] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {shoppingListCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
