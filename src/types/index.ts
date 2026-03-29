export interface Recipe {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  source?: string;
  createdAt?: string;
}

export interface Ingredient {
  id: number;
  recipeId: number;
  name: string;
  amount?: string;
  unit?: string;
}

export interface Step {
  id: number;
  recipeId: number;
  stepNumber: number;
  instruction: string;
}

export interface RecipeDetail extends Recipe {
  ingredients: Ingredient[];
  steps: Step[];
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  source?: string;
}
