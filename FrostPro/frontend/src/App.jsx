// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth'; 
import GoalSetupPage from './pages/GoalSetupPage'; 
import DashboardPage from './pages/dashboard';
import QuestMapPage from './pages/QuestMapPage';
import ProfilePage from './pages/profile';
// import DashboardPage from './pages/DashboardPage'; 

// import QuestMapPage from './pages/map'; 
// import LevelDetailPage from './pages/LevelDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/goal-setup" element={<GoalSetupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/quest-map" element={<QuestMapPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/map" element={<QuestMapPage />} /> */}
        {/* <Route path="/level/:id" element={<LevelDetailPage />} /> */}
        
        {/* Add other routes like /auth, /dashboard, etc later */}
      </Routes>
    </Router>
  );
}

export default App;