import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Recipe } from '../types'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const imageUrl = recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <Link to={`/recipe/${recipe.id}`}>
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'
            }}
          />
          
          {/* Category Badge */}
          {recipe.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#FF6B35] text-white text-sm font-medium px-3 py-1 rounded-full">
                {recipe.category}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#2D2D2D] mb-3 line-clamp-2">{recipe.title}</h3>
          
          {/* Recipe Meta */}
          <div className="flex items-center justify-between text-sm text-[#2D2D2D]/70">
            <div className="flex items-center space-x-4">
              {totalTime > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{totalTime} min</span>
                </div>
              )}
              
              {recipe.servings && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{recipe.servings} servings</span>
                </div>
              )}
            </div>
            
            <div className="text-[#FF6B35] font-medium">
              View Recipe →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
