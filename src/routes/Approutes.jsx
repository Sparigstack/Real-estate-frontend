import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from '../pages/Signup-Login/Login';

export default function Approutes() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}
