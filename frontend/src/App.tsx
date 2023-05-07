import React from 'react';
import Home from './components/HomeComponent'
import Multiplayer from './components/MultiplayerScreen'
import Solo from './components/SoloGameScreen'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/Solo" element={<Solo />} />
          <Route path="/Multiplayer" element={<Multiplayer />} />
        </Routes>
      </div>
    </Router>
  );
}
