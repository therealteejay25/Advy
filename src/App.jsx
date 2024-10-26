import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import Schedule from './pages/Schedule';
import Download from './pages/Download';
import Retreive from './pages/Retreive';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/download" element={<Download />} />
        <Route path="/retreive" element={<Retreive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
