import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import DrinkCustomizePage from './pages/DrinkCustomizePage'
import CartPage from './pages/CartPage'
import Footer from './components/Footer'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background-dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/customize/:id" element={<DrinkCustomizePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
