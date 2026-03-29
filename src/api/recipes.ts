import type { Recipe, RecipeDetail, CreateRecipeData } from '../types';

const API_URL = 'https://recipe-app-worker.urlcut01.workers.dev';

export const getRecipes = async (search?: string, category?: string): Promise<Recipe[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  
  const response = await fetch(`${API_URL}/api/recipes?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
};

export const getRecipe = async (id: number): Promise<RecipeDetail> => {
  const response = await fetch(`${API_URL}/api/recipes/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipe');
  }
  return response.json();
};

export const createRecipe = async (data: CreateRecipeData): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create recipe');
  }
  return response.json();
};

export const deleteRecipe = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
};
