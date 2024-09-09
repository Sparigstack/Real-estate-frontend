import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from '../pages/Signup-Login/Login';
import PageNotFound from '../pages/404-ErrorPage/PageNotFound.JSX';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoutes from './PrivateRoutes';

export default function Approutes() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
      <Route element={<PrivateRoutes />}>
      <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      </Routes>
    </Router>
  )
}
