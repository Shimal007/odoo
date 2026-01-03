import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import TravelItineraryBuilder from './pages/plan.jsx'

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Odoo Travel</h1>
      <Link to="/plan" className="nav-link">
        Go to Travel Itinerary Builder →
      </Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<TravelItineraryBuilder />} />
    </Routes>
  )
}

export default App
