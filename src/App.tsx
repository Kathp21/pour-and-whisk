import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-dark">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
