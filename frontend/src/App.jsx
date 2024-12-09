import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/NSS/HomePage';
import EventPage from './components/NSS/EventPage';


function App() {
  

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Event/:id/:duration" element={<EventPage/>} />      
        </Routes>
      </Router>
    </div>
  );
}

export default App;