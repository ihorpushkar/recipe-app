import { useState, useEffect } from 'react'
import type { RecipeDetail } from '../types'

export interface ShoppingListIngredient {
  id: number
  name: string
  amount?: string
  unit?: string
  isChecked: boolean
}

export interface ShoppingListItem {
  recipeId: number
  recipeTitle: string
  ingredients: ShoppingListIngredient[]
}

export function useShoppingList() {
  const [list, setList] = useState<ShoppingListItem[]>([])

  // Load list from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shopping-list')
    if (stored) {
      try {
        setList(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse shopping list:', error)
        localStorage.removeItem('shopping-list')
      }
    }
  }, [])

  // Save list to localStorage whenever it changes
  useEffect(() => {
    if (list.length > 0) {
      localStorage.setItem('shopping-list', JSON.stringify(list))
    } else {
      localStorage.removeItem('shopping-list')
    }
    
    // Trigger storage event for navbar to update
    window.dispatchEvent(new Event('storage'))
  }, [list])

  const addRecipeToList = (recipe: RecipeDetail) => {
    setList(prevList => {
      // Check if recipe already exists
      const existingIndex = prevList.findIndex(item => item.recipeId === recipe.id)
      
      if (existingIndex !== -1) {
        // Recipe already exists, return unchanged
        return prevList
      }

      // Add new recipe to list
      const newItem: ShoppingListItem = {
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        ingredients: recipe.ingredients.map(ingredient => ({
          id: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          isChecked: false
        }))
      }

      return [...prevList, newItem]
    })
  }

  const toggleItem = (recipeId: number, ingredientId: number) => {
    setList(prevList => 
      prevList.map(item => 
        item.recipeId === recipeId
          ? {
              ...item,
              ingredients: item.ingredients.map(ingredient =>
                ingredient.id === ingredientId
                  ? { ...ingredient, isChecked: !ingredient.isChecked }
                  : ingredient
              )
            }
          : item
      )
    )
  }

  const removeRecipe = (recipeId: number) => {
    setList(prevList => prevList.filter(item => item.recipeId !== recipeId))
  }

  const clearList = () => {
    setList([])
  }

  const getTotalCount = () => {
    return list.reduce((total, item) => 
      total + item.ingredients.filter(ing => !ing.isChecked).length, 0
    )
  }

  const isRecipeInList = (recipeId: number) => {
    return list.some(item => item.recipeId === recipeId)
  }

  return {
    list,
    addRecipeToList,
    toggleItem,
    removeRecipe,
    clearList,
    getTotalCount,
    isRecipeInList
  }
}
