import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { Env } from '../types'

const spoonacular = new Hono<{ Bindings: Env }>()

// Search recipes via Spoonacular API
spoonacular.get('/search', async (c) => {
  const query = c.req.query('query')
  const diet = c.req.query('diet')
  const number = c.req.query('number') || '10'
  
  if (!query) {
    return c.json({ error: 'Query parameter is required' }, 400)
  }

  try {
    const searchParams = new URLSearchParams({
      query,
      number,
      apiKey: c.env.SPOONACULAR_API_KEY,
      addRecipeInformation: 'true', // Ensure we get detailed info
      fillIngredients: 'false',
    })
    
    if (diet) {
      searchParams.append('diet', diet)
    }

    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${searchParams.toString()}`
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Spoonacular API error response:', errorText)
      throw new Error(`Spoonacular API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Debug: Log the actual API response structure
    console.log('Spoonacular API response sample:', JSON.stringify(data.results?.[0] || {}, null, 2))
    
    // Return simplified list with proper field mapping
    const simplifiedResults = data.results.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || recipe.cookingMinutes || recipe.preparationMinutes || 0,
      servings: recipe.servings || 4, // Default to 4 if missing
    }))
    
    return c.json({
      results: simplifiedResults,
      totalResults: data.totalResults,
      offset: data.offset,
      number: data.number,
    })
  } catch (error) {
    console.error('Spoonacular search error:', error)
    return c.json({ error: 'Failed to search recipes' }, 500)
  }
})

// Get full recipe details from Spoonacular
spoonacular.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  if (!id) {
    return c.json({ error: 'Recipe ID is required' }, 400)
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${c.env.SPOONACULAR_API_KEY}&includeNutrition=false`
    )
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    const recipe = await response.json()
    
    // Return full recipe details
    return c.json({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      sourceUrl: recipe.sourceUrl,
      summary: recipe.summary,
      instructions: recipe.instructions,
      analyzedInstructions: recipe.analyzedInstructions,
      extendedIngredients: recipe.extendedIngredients,
      diets: recipe.diets,
      dishTypes: recipe.dishTypes,
      occasions: recipe.occasions,
    })
  } catch (error) {
    console.error('Spoonacular recipe details error:', error)
    return c.json({ error: 'Failed to fetch recipe details' }, 500)
  }
})

// Import recipe from Spoonacular to D1 database
spoonacular.post('/:id/import', async (c) => {
  const id = c.req.param('id')
  
  if (!id) {
    return c.json({ error: 'Recipe ID is required' }, 400)
  }

  try {
    console.log(`=== STARTING IMPORT FOR SPOONACULAR RECIPE ID: ${id} ===`)
    
    // First fetch full recipe from Spoonacular
    const spoonacularUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${c.env.SPOONACULAR_API_KEY}&includeNutrition=false`
    console.log(`[STEP 1] Fetching from Spoonacular API: ${spoonacularUrl}`)
    
    const spoonacularResponse = await fetch(spoonacularUrl)
    console.log(`[STEP 1] Spoonacular API response status: ${spoonacularResponse.status}`)
    
    if (!spoonacularResponse.ok) {
      const errorText = await spoonacularResponse.text()
      console.error(`[STEP 1 ERROR] Spoonacular API error response: ${errorText}`)
      throw new Error(`Spoonacular API error: ${spoonacularResponse.status} - ${errorText}`)
    }

    const spoonacularRecipe = await spoonacularResponse.json()
    console.log(`[STEP 1 SUCCESS] Raw Spoonacular API response:`, JSON.stringify(spoonacularRecipe, null, 2))
    
    // Check if database is accessible
    console.log(`[STEP 2] Checking database accessibility...`)
    if (!c.env.DB) {
      console.error(`[STEP 2 ERROR] Database not available in environment`)
      throw new Error('Database not available')
    }
    console.log(`[STEP 2 SUCCESS] Database is accessible`)
    
    // Map to our database schema
    console.log(`[STEP 3] Initializing Drizzle ORM...`)
    const db = drizzle(c.env.DB, { schema })
    console.log(`[STEP 3 SUCCESS] Drizzle ORM initialized`)
    
    // Create recipe record
    console.log(`[STEP 4] Preparing recipe data for insertion...`)
    const recipeData = {
      title: spoonacularRecipe.title,
      description: spoonacularRecipe.summary?.replace(/<[^>]*>/g, '') || '',
      imageUrl: spoonacularRecipe.image,
      prepTime: spoonacularRecipe.preparationMinutes || 0,
      cookTime: spoonacularRecipe.cookingMinutes || 0,
      servings: spoonacularRecipe.servings || 4,
      category: spoonacularRecipe.dishTypes?.[0] || 'Other',
      source: spoonacularRecipe.sourceUrl,
    }
    console.log(`[STEP 4] Recipe data prepared:`, JSON.stringify(recipeData, null, 2))
    
    console.log(`[STEP 4] Inserting recipe into database...`)
    const newRecipe = await db.insert(schema.recipes).values(recipeData).returning().get()

    if (!newRecipe) {
      console.error(`[STEP 4 ERROR] Failed to create recipe - no result returned from database`)
      throw new Error('Failed to create recipe - no result returned')
    }
    
    console.log(`[STEP 4 SUCCESS] Recipe created with ID: ${newRecipe.id}`)
    console.log(`[STEP 4 SUCCESS] Created recipe data:`, JSON.stringify(newRecipe, null, 2))

    // Create ingredients
    console.log(`[STEP 5] Preparing ingredients for insertion...`)
    const ingredientsArray = spoonacularRecipe.extendedIngredients || []
    console.log(`[STEP 5] Found ${ingredientsArray.length} ingredients in Spoonacular response`)
    
    const ingredientsToInsert = ingredientsArray.map((ing: any, index: number) => {
      const ingredient = {
        recipeId: newRecipe.id,
        name: ing.name || 'Unknown ingredient',
        amount: ing.amount?.toString() || '',
        unit: ing.unit || '',
      }
      console.log(`[STEP 5] Ingredient ${index + 1}:`, JSON.stringify(ingredient, null, 2))
      return ingredient
    })

    console.log(`[STEP 5] Inserting ${ingredientsToInsert.length} ingredients into database...`)
    if (ingredientsToInsert.length > 0) {
      await db.insert(schema.ingredients).values(ingredientsToInsert)
      console.log(`[STEP 5 SUCCESS] Successfully inserted ${ingredientsToInsert.length} ingredients`)
    } else {
      console.log(`[STEP 5 INFO] No ingredients to insert`)
    }

    // Create steps from analyzed instructions
    console.log(`[STEP 6] Preparing steps for insertion...`)
    const analyzedSteps = spoonacularRecipe.analyzedInstructions?.[0]?.steps || []
    console.log(`[STEP 6] Found ${analyzedSteps.length} analyzed steps in Spoonacular response`)
    
    const stepsToInsert = analyzedSteps.map((step: any) => {
      const stepData = {
        recipeId: newRecipe.id,
        stepNumber: step.number,
        instruction: step.step,
      }
      console.log(`[STEP 6] Analyzed step ${step.number}:`, JSON.stringify(stepData, null, 2))
      return stepData
    })

    // If no analyzed instructions, try to parse regular instructions
    if (stepsToInsert.length === 0 && spoonacularRecipe.instructions) {
      console.log(`[STEP 6] No analyzed steps found, parsing regular instructions...`)
      const instructionLines = spoonacularRecipe.instructions
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string, index: number) => {
          const stepData = {
            recipeId: newRecipe.id,
            stepNumber: index + 1,
            instruction: line.trim(),
          }
          console.log(`[STEP 6] Parsed step ${index + 1}:`, JSON.stringify(stepData, null, 2))
          return stepData
        })
      
      stepsToInsert.push(...instructionLines)
      console.log(`[STEP 6] Parsed ${instructionLines.length} steps from regular instructions`)
    }

    console.log(`[STEP 6] Inserting ${stepsToInsert.length} steps into database...`)
    if (stepsToInsert.length > 0) {
      await db.insert(schema.steps).values(stepsToInsert)
      console.log(`[STEP 6 SUCCESS] Successfully inserted ${stepsToInsert.length} steps`)
    } else {
      console.log(`[STEP 6 INFO] No steps to insert`)
    }

    // Fetch the complete recipe with ingredients and steps
    console.log(`[STEP 7] Verifying saved data...`)
    const savedIngredients = await db.select().from(schema.ingredients).where(eq(schema.ingredients.recipeId, newRecipe.id))
    const savedSteps = await db.select().from(schema.steps).where(eq(schema.steps.recipeId, newRecipe.id)).orderBy(schema.steps.stepNumber)

    console.log(`[STEP 7 SUCCESS] Verification complete:`)
    console.log(`[STEP 7 SUCCESS] - Saved ingredients: ${savedIngredients.length}`)
    console.log(`[STEP 7 SUCCESS] - Saved steps: ${savedSteps.length}`)
    console.log(`[STEP 7 SUCCESS] - Saved ingredients data:`, JSON.stringify(savedIngredients, null, 2))
    console.log(`[STEP 7 SUCCESS] - Saved steps data:`, JSON.stringify(savedSteps, null, 2))

    const result = {
      ...newRecipe,
      ingredients: savedIngredients,
      steps: savedSteps,
    }
    
    console.log(`=== IMPORT COMPLETED SUCCESSFULLY FOR RECIPE ID: ${newRecipe.id} ===`)
    return c.json(result, 201)
  } catch (error) {
    console.error(`=== IMPORT FAILED FOR SPOONACULAR RECIPE ID: ${id} ===`)
    console.error(`[CATCH BLOCK] Import error:`, error)
    console.error(`[CATCH BLOCK] Error type:`, typeof error)
    console.error(`[CATCH BLOCK] Error message:`, error instanceof Error ? error.message : 'No error message')
    console.error(`[CATCH BLOCK] Error stack:`, error instanceof Error ? error.stack : 'No stack available')
    
    // Try to get more details if it's a fetch error
    if (error instanceof Error && error.message.includes('fetch')) {
      console.error(`[CATCH BLOCK] This appears to be a network/fetch error`)
    }
    
    // Return more detailed error information
    return c.json({ 
      error: 'Failed to import recipe',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      spoonacularId: id
    }, 500)
  }
})

export { spoonacular }
