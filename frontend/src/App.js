import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import Rooms from './containers/RoomsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </Router>
  );
}

export default App;
