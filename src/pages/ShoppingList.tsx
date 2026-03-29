import { Link } from 'react-router-dom'
import { useShoppingList } from '../hooks/useShoppingList'

export default function ShoppingList() {
  const { list, toggleItem, removeRecipe, clearList, getTotalCount } = useShoppingList()

  const uncheckedCount = getTotalCount()
  const totalCount = list.reduce((total, item) => total + item.ingredients.length, 0)
  const progressPercentage = totalCount > 0 ? ((totalCount - uncheckedCount) / totalCount) * 100 : 0

  if (list.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] py-8">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
              Your shopping list is empty
            </h2>
            <p className="text-[#2D2D2D]/70 mb-8">
              Add ingredients from a recipe!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-8">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-2">
              Shopping List
            </h1>
            <p className="text-[#2D2D2D]/70">
              {uncheckedCount} {uncheckedCount === 1 ? 'item' : 'items'} to buy
            </p>
          </div>
          
          {list.length > 0 && (
            <button
              onClick={clearList}
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#2D2D2D]/70">Progress</span>
              <span className="text-sm text-[#2D2D2D]/70">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-[#FF6B35] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Shopping List Items */}
        <div className="space-y-6">
          {list.map((item, recipeIndex) => (
            <div key={item.recipeId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Recipe Header */}
              <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {item.recipeTitle}
                  </h3>
                  <button
                    onClick={() => removeRecipe(item.recipeId)}
                    className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Remove Recipe
                  </button>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="p-4">
                <div className="space-y-2">
                  {item.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        ingredient.isChecked ? 'bg-gray-50' : recipeIndex % 2 === 0 ? 'bg-orange-50' : 'bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={ingredient.isChecked}
                        onChange={() => toggleItem(item.recipeId, ingredient.id)}
                        className="w-5 h-5 text-[#FF6B35] rounded focus:ring-[#FF6B35] focus:ring-2"
                      />
                      <div className="flex-1">
                        <span
                          className={`text-[#2D2D2D] ${
                            ingredient.isChecked ? 'line-through opacity-60' : ''
                          }`}
                        >
                          {ingredient.name}
                        </span>
                        {ingredient.amount && (
                          <span className={`ml-2 text-[#2D2D2D]/70 ${
                            ingredient.isChecked ? 'line-through opacity-60' : ''
                          }`}>
                            {ingredient.unit ? `${ingredient.amount} ${ingredient.unit}` : ingredient.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {uncheckedCount === 0 && list.length > 0 && (
          <div className="mt-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
              All done!
            </h3>
            <p className="text-[#2D2D2D]/70">
              You've checked off all items on your shopping list
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
