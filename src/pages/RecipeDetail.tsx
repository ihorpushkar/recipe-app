import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipe, deleteRecipe } from '../api/recipes'
import { useShoppingList } from '../hooks/useShoppingList'
import type { RecipeDetail } from '../types'

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const { addRecipeToList, isRecipeInList } = useShoppingList()

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const data = await getRecipe(Number(id))
        setRecipe(data)
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  const handleAddToShoppingList = () => {
    if (!recipe) return
    addRecipeToList(recipe)
  }

  const handleDeleteRecipe = async () => {
    if (!recipe || !id) return
    
    try {
      setDeleting(true)
      await deleteRecipe(Number(id))
      navigate('/')
    } catch (error) {
      console.error('Failed to delete recipe:', error)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Recipe not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const isInShoppingList = isRecipeInList(recipe.id)

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop'}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-t-3xl shadow-xl -mt-12 relative z-10">
          {/* Title and Category */}
          <div className="p-8 border-b border-gray-100">
            {recipe.category && (
              <span className="inline-block bg-[#FF6B35] text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                {recipe.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-lg text-[#2D2D2D]/70">
                {recipe.description.replace(/<[^>]*>/g, '')}
              </p>
            )}
          </div>

          {/* Recipe Meta */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Prep: {recipe.prepTime && recipe.prepTime > 0 ? `${recipe.prepTime} min` : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Cook: {recipe.cookTime && recipe.cookTime > 0 ? `${recipe.cookTime} min` : 'N/A'}</span>
              </div>
              {recipe.servings && (
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{recipe.servings} servings</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-wrap gap-4">
              {isInShoppingList ? (
                <button
                  disabled
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg cursor-not-allowed opacity-75"
                >
                  ✓ Already in list
                </button>
              ) : (
                <button
                  onClick={handleAddToShoppingList}
                  className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
                >
                  🛒 Add to Shopping List
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Delete Recipe
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Ingredients Panel */}
            <div className="bg-orange-50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-start space-x-2 text-left">
                    <span className="text-[#FF6B35] mt-1 flex-shrink-0">•</span>
                    <div className="flex-1">
                      <span className="text-[#2D2D2D] font-medium">{ingredient.name}</span>
                      {ingredient.amount && (
                        <span className="text-[#2D2D2D]/70">
                          {ingredient.unit ? ` ${ingredient.amount} ${ingredient.unit}` : ` ${ingredient.amount}`}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps Panel */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps
                  .sort((a, b) => a.stepNumber - b.stepNumber)
                  .map((step) => (
                    <li key={step.id} className="flex space-x-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {step.stepNumber}
                      </span>
                      <p className="text-[#2D2D2D] pt-1 text-left">{step.instruction}</p>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">
              Delete Recipe?
            </h3>
            <p className="text-[#2D2D2D]/70 mb-6">
              Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteRecipe}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-[#2D2D2D] rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
