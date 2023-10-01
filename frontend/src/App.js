import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Rooms from './pages/RoomsPage';
import RoomsAdmin from './pages/RoomsPageAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/roomsAdmin" element={<RoomsAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
