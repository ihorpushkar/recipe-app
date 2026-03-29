import { useState, useEffect } from 'react'
import { getRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'
import SkeletonCard from '../components/SkeletonCard'
import type { Recipe } from '../types'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const category = selectedCategory === 'All' ? undefined : selectedCategory
        const data = await getRecipes(debouncedSearch, category)
        setRecipes(data)
      } catch (error) {
        console.error('Failed to fetch recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [debouncedSearch, selectedCategory])

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Next Favorite Recipe
            </h1>
            <p className="text-xl sm:text-2xl mb-8 opacity-90">
              Discover delicious recipes from around the world
            </p>
            
            {/* Search Bar in Hero */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-white placeholder-white/70 bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg text-left"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-[#FF6B35] text-white shadow-lg'
                  : 'bg-white text-[#2D2D2D] hover:bg-[#FF6B35] hover:text-white shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Show 3 skeleton cards while loading
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🍳</div>
              <h3 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
                No recipes found
              </h3>
              <p className="text-lg text-[#2D2D2D]/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
