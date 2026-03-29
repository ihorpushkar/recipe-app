import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecipe } from '../api/recipes'
import type { CreateRecipeData } from '../types'

interface Ingredient {
  id: string
  name: string
  amount: string
  unit: string
}

interface Step {
  id: string
  instruction: string
  stepNumber: number
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function AddRecipe() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  
  // Dynamic lists
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', amount: '', unit: '' }
  ])
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', instruction: '', stepNumber: 1 }
  ])

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      amount: '',
      unit: ''
    }
    setIngredients([...ingredients, newIngredient])
  }

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id))
    }
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ))
  }

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      instruction: '',
      stepNumber: steps.length + 1
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      const filteredSteps = steps.filter(step => step.id !== id)
      // Renumber remaining steps
      const renumberedSteps = filteredSteps.map((step, index) => ({
        ...step,
        stepNumber: index + 1
      }))
      setSteps(renumberedSteps)
    }
  }

  const updateStep = (id: string, instruction: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, instruction } : step
    ))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    // Validate that at least one ingredient has a name
    const hasValidIngredient = ingredients.some(ing => ing.name.trim())
    if (!hasValidIngredient) {
      newErrors.ingredients = 'At least one ingredient is required'
    }
    
    // Validate that at least one step has instruction
    const hasValidStep = steps.some(step => step.instruction.trim())
    if (!hasValidStep) {
      newErrors.steps = 'At least one step is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setSubmitting(true)
      
      const recipeData: CreateRecipeData = {
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        category: category || undefined,
        prepTime: prepTime ? Number(prepTime) : undefined,
        cookTime: cookTime ? Number(cookTime) : undefined,
        servings: servings ? Number(servings) : undefined
      }
      
      const newRecipe = await createRecipe(recipeData)
      navigate(`/recipe/${newRecipe.id}`)
    } catch (error) {
      console.error('Failed to create recipe:', error)
      setErrors({ submit: 'Failed to create recipe. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-8">
            Add New Recipe
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#2D2D2D] border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Enter recipe title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="Describe your recipe"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Time and Servings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="prepTime" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="prepTime"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label htmlFor="cookTime" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="cookTime"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-[#2D2D2D] mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    id="servings"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="4"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#2D2D2D] border-b border-gray-200 pb-2">
                  Ingredients
                </h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
                >
                  + Add Ingredient
                </button>
              </div>
              
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex gap-3 items-center">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-[#2D2D2D]">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                      placeholder="Amount"
                      className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                      placeholder="Unit"
                      className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.ingredients && (
                <p className="text-sm text-red-500">{errors.ingredients}</p>
              )}
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#2D2D2D] border-b border-gray-200 pb-2">
                  Instructions
                </h2>
                <button
                  type="button"
                  onClick={addStep}
                  className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
                >
                  + Add Step
                </button>
              </div>
              
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-7 h-7 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.stepNumber}
                    </span>
                    <textarea
                      value={step.instruction}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      placeholder="Describe this step..."
                      rows={2}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.steps && (
                <p className="text-sm text-red-500">{errors.steps}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-[#2D2D2D] rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#FF6B35]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Create Recipe'
                )}
              </button>
            </div>

            {errors.submit && (
              <div className="text-center">
                <p className="text-red-500">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
