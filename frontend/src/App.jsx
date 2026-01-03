import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import TripView from './pages/TripView';
import TripEdit from './pages/TripEdit';
import TripBudget from './pages/TripBudget';
import Discover from './pages/Discover';
import ActivitySearch from './pages/ActivitySearch';
import Inspiration from './pages/Inspiration';
import Packages from './pages/Packages';
import SharedTrip from './pages/SharedTrip';
import Profile from './pages/Profile';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trips"
          element={user ? <MyTrips user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trips/create"
          element={user ? <CreateTrip user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trips/:tripId/edit"
          element={user ? <TripEdit user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trips/:tripId"
          element={user ? <TripView user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/discover"
          element={user ? <Discover user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />}
        />

        {/* Budget & Activities */}
        <Route
          path="/trips/:tripId/budget"
          element={user ? <TripBudget user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/activities"
          element={user ? <ActivitySearch user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/inspiration"
          element={user ? <Inspiration user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/packages"
          element={user ? <Packages user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Public Routes - No Auth Required */}
        <Route
          path="/shared/:tripId"
          element={<SharedTrip />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Home />}
        />
      </Routes>
    </Router>
  );
}

export default App;
