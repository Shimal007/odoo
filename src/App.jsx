import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import CreateTrip from './CreateTrip';
import BuildItinerary from './BuildItinerary';
import ItineraryView from './ItineraryView';
import Profile from './Profile';
import './index.css';

function App() {
  // Mock user for visibility purposes, as requested by the user
  const [user, setUser] = useState({
    _id: 'abc123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    profile_photo: '🧳'
  });

  const handleLogout = () => setUser(null);
  const handleUpdateUser = (updated) => setUser(updated);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/create-trip" />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/build-itinerary/:tripId" element={<BuildItinerary />} />
          <Route path="/view-itinerary/:tripId" element={<ItineraryView />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              />
            }
          />
          {/* Default login route to prevent crashes if Profile redirects */}
          <Route path="/login" element={<Navigate to="/profile" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
