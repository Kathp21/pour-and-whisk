import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import DrinkCustomizePage from './pages/DrinkCustomizePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AboutPage from './pages/AboutPage'
import Footer from './components/Footer'
import AdminLoginPage from './admin/AdminLoginPage'
import ProtectedAdminLayout from './admin/ProtectedAdminLayout'
import OrdersPage from './admin/OrdersPage'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background-dark flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu/customize/:id" element={<DrinkCustomizePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              
              {/* Admin login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected admin area */}
              <Route path="/admin" element={<ProtectedAdminLayout />}>
                <Route path="orders" element={<OrdersPage />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
