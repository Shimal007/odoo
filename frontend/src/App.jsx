import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLandingPage from "./components/MainLandingPage";
import CreateTrip from './components/CreateTrip';
import BuildItinerary from './components/BuildItinerary';
import ItineraryView from './components/ItineraryView';
import Discover from './components/Discover';
// Placeholder for Screen 4
const CreateTripPage = () => (
  <div className="min-h-screen bg-[#FDF8F5] flex items-center justify-center text-[#4A3B32]">
    <h1 className="text-3xl font-serif">Create New Trip Page (Screen 4)</h1>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLandingPage />} />
        <Route path="/create-trip" element={<CreateTrip />} />

        <Route path="/build-itinerary/:tripId" element={<BuildItinerary />} />
        <Route path="/view-itinerary/:tripId" element={<ItineraryView />} />
        <Route path="/discover" element={<Discover />} />
      </Routes>
    </Router>
  );
};

export default App;
