-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  category TEXT,
  source TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount TEXT,
  unit TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

-- Steps table
CREATE TABLE IF NOT EXISTS steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients (recipe_id);
CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON steps (recipe_id);
CREATE INDEX IF NOT EXISTS idx_steps_recipe_step ON steps (recipe_id, step_number);
