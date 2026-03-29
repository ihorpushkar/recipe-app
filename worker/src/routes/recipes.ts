import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { Env } from '../types'

const recipes = new Hono<{ Bindings: Env }>()

// Get all recipes
recipes.get('/', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const allRecipes = await db.select().from(schema.recipes)
  return c.json(allRecipes)
})

// Get recipe by ID with ingredients and steps
recipes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB, { schema })
  
  const recipe = await db.select().from(schema.recipes).where(eq(schema.recipes.id, Number(id))).get()
  if (!recipe) {
    return c.json({ error: 'Recipe not found' }, 404)
  }
  
  const ingredients = await db.select().from(schema.ingredients).where(eq(schema.ingredients.recipeId, Number(id)))
  const steps = await db.select().from(schema.steps).where(eq(schema.steps.recipeId, Number(id))).orderBy(schema.steps.stepNumber)
  
  return c.json({ ...recipe, ingredients, steps })
})

// Create new recipe
recipes.post('/', async (c) => {
  const body = await c.req.json()
  const db = drizzle(c.env.DB, { schema })
  
  const recipe = await db.insert(schema.recipes).values({
    title: body.title,
    description: body.description,
    imageUrl: body.imageUrl,
    prepTime: body.prepTime,
    cookTime: body.cookTime,
    servings: body.servings,
    category: body.category,
    source: body.source,
  }).returning().get()
  
  return c.json(recipe, 201)
})

// Update recipe
recipes.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const db = drizzle(c.env.DB, { schema })
  
  const recipe = await db.update(schema.recipes)
    .set({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      prepTime: body.prepTime,
      cookTime: body.cookTime,
      servings: body.servings,
      category: body.category,
      source: body.source,
    })
    .where(eq(schema.recipes.id, Number(id)))
    .returning()
    .get()
  
  if (!recipe) {
    return c.json({ error: 'Recipe not found' }, 404)
  }
  
  return c.json(recipe)
})

// Delete recipe
recipes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB, { schema })
  
  await db.delete(schema.ingredients).where(eq(schema.ingredients.recipeId, Number(id)))
  await db.delete(schema.steps).where(eq(schema.steps.recipeId, Number(id)))
  await db.delete(schema.recipes).where(eq(schema.recipes.id, Number(id)))
  
  return c.json({ message: 'Recipe deleted successfully' })
})

export { recipes }
