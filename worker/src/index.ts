import { Hono } from 'hono'
import { recipes } from './routes/recipes'
import { spoonacular } from './routes/spoonacular'
import { cors } from 'hono/cors'

const app = new Hono()

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Routes
app.route('/api/recipes', recipes)
app.route('/api/spoonacular', spoonacular)

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Recipe App API is running!' })
})

export default app
