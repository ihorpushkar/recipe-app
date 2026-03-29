import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import AddRecipe from './pages/AddRecipe'
import SearchRecipes from './pages/SearchRecipes'
import ShoppingList from './pages/ShoppingList'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFF8F0]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/add" element={<AddRecipe />} />
            <Route path="/search" element={<SearchRecipes />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
