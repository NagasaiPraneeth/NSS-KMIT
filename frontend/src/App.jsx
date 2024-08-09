import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoiceAnalyzer from './components/InvoiceAnalyzer';

function App() {
 

 

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<InvoiceAnalyzer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;