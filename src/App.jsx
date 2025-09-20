import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './Pages/DashBoard';
import Products from './Pages/Products';
import DashBoardLayout from './components/DashBoardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DashBoardLayout>
              <DashBoard />
            </DashBoardLayout>
          }
        />
        <Route
          path="/products"
          element={
            <DashBoardLayout> 
              <Products />
            </DashBoardLayout>
          }
        />
      
      </Routes>
    </Router>
  );
}

export default App;