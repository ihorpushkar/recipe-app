import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  prepTime: integer('prep_time'),
  cookTime: integer('cook_time'),
  servings: integer('servings'),
  category: text('category'),
  source: text('source'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
})

export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').notNull(),
  name: text('name').notNull(),
  amount: text('amount'),
  unit: text('unit'),
})

export const steps = sqliteTable('steps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').notNull(),
  stepNumber: integer('step_number').notNull(),
  instruction: text('instruction').notNull(),
})

export type Recipe = typeof recipes.$inferSelect
export type NewRecipe = typeof recipes.$inferInsert
export type Ingredient = typeof ingredients.$inferSelect
export type NewIngredient = typeof ingredients.$inferInsert
export type Step = typeof steps.$inferSelect
export type NewStep = typeof steps.$inferInsert
