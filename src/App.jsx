import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateTrip from './CreateTrip';
import BuildItinerary from './BuildItinerary';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/create-trip" />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/build-itinerary/:tripId" element={<BuildItinerary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
