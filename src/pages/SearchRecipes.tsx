import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { searchSpoonacular, importSpoonacularRecipe, type SpoonacularRecipe } from '../api/spoonacular'
import SkeletonCard from '../components/SkeletonCard'

const DIETS = ['Any', 'Vegetarian', 'Vegan', 'Gluten Free']

interface ImportStatus {
  [key: number]: 'idle' | 'importing' | 'imported' | 'error'
}

export default function SearchRecipes() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedDiet, setSelectedDiet] = useState('Any')
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<ImportStatus>({})
  const [importedRecipeIds, setImportedRecipeIds] = useState<{ [key: number]: number }>({})

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const searchRecipes = async () => {
      if (!debouncedQuery.trim()) {
        setRecipes([])
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await searchSpoonacular(debouncedQuery, selectedDiet)
        setRecipes(data.results)
      } catch (err) {
        setError('Failed to search recipes. Please try again.')
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    searchRecipes()
  }, [debouncedQuery, selectedDiet])

  const handleImport = async (spoonacularId: number) => {
    try {
      setImportStatus(prev => ({ ...prev, [spoonacularId]: 'importing' }))
      
      const importedRecipe = await importSpoonacularRecipe(spoonacularId)
      setImportedRecipeIds(prev => ({ ...prev, [spoonacularId]: importedRecipe.id }))
      setImportStatus(prev => ({ ...prev, [spoonacularId]: 'imported' }))
      
      console.log('Successfully imported recipe:', importedRecipe)
    } catch (err) {
      console.error('Import failed:', err)
      setImportStatus(prev => ({ ...prev, [spoonacularId]: 'error' }))
      
      // Show more detailed error in console for debugging
      if (err instanceof Error && err.message) {
        try {
          const errorDetails = JSON.parse(err.message)
          console.error('Import error details:', errorDetails)
        } catch {
          console.error('Import error message:', err.message)
        }
      }
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setImportStatus(prev => ({ ...prev, [spoonacularId]: 'idle' }))
      }, 5000)
    }
  }

  const handleViewRecipe = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`)
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-8">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-4">
            Search Recipes
          </h1>
          <p className="text-lg text-[#2D2D2D]/70">
            Discover recipes from around the world
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for recipes, ingredients, or cuisines..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-[#2D2D2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Diet Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {DIETS.map((diet) => (
            <button
              key={diet}
              onClick={() => setSelectedDiet(diet)}
              className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedDiet === diet
                  ? 'bg-[#FF6B35] text-white shadow-lg'
                  : 'bg-white text-[#2D2D2D] hover:bg-[#FF6B35] hover:text-white shadow-md'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Show skeleton cards while searching
            Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : recipes.length > 0 ? (
            recipes.map((recipe) => {
              const status = importStatus[recipe.id]
              const importedId = importedRecipeIds[recipe.id]
              
              return (
                <div key={recipe.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {/* Recipe Image */}
                  <div className="relative h-56">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
                      }}
                    />
                  </div>

                  {/* Recipe Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-[#2D2D2D] mb-3 line-clamp-2 text-lg">
                      {recipe.title}
                    </h3>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-[#2D2D2D]/70 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{recipe.readyInMinutes} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {importedId ? (
                      <button
                        onClick={() => handleViewRecipe(importedId)}
                        className="w-full px-4 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        View Recipe
                      </button>
                    ) : (
                      <button
                        onClick={() => handleImport(recipe.id)}
                        disabled={status === 'importing'}
                        className={`w-full px-4 py-3 font-medium rounded-lg transition-colors ${
                          status === 'importing'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : status === 'error'
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90'
                        }`}
                      >
                        {status === 'importing' ? (
                          <span className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Importing...</span>
                          </span>
                        ) : status === 'error' ? (
                          'Try Again'
                        ) : status === 'imported' ? (
                          'Recipe imported!'
                        ) : (
                          'Import'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            // Empty state
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-[#2D2D2D] mb-4">
                {query ? 'No recipes found' : 'Start searching for recipes'}
              </h3>
              <p className="text-lg text-[#2D2D2D]/70">
                {query 
                  ? 'Try different keywords or filters'
                  : 'Enter a search term to find delicious recipes'
                }
                Enter a keyword to discover delicious recipes
              </p>
            </div>
          )}

          {error && (
            <div className="col-span-full text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
