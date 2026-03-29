const API_URL = 'https://recipe-app-worker.urlcut01.workers.dev'

export interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
}

export interface SpoonacularSearchResponse {
  results: SpoonacularRecipe[]
  totalResults: number
  offset: number
  number: number
}

export interface ImportedRecipe {
  id: number
  title: string
  description?: string
  imageUrl?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  category?: string
  source?: string
  ingredients: any[]
  steps: any[]
}

export const searchSpoonacular = async (query: string, diet?: string): Promise<SpoonacularSearchResponse> => {
  const params = new URLSearchParams({
    query,
    number: '12', // Get 12 results for grid layout
  })
  
  if (diet && diet !== 'Any') {
    params.append('diet', diet.toLowerCase())
  }

  const response = await fetch(`${API_URL}/api/spoonacular/search?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to search recipes')
  }
  return response.json()
}

export const importSpoonacularRecipe = async (spoonacularId: number): Promise<ImportedRecipe> => {
  const response = await fetch(`${API_URL}/api/spoonacular/${spoonacularId}/import`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to import recipe')
  }
  return response.json()
}
