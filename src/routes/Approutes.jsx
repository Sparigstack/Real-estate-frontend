import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from '../pages/Signup-Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoutes from './PrivateRoutes';
import PageNotFound from '../pages/404-ErrorPage/PageNotFound';
import Layout from '../components/layout/Layout';
import UserDetailsForm from '../pages/Signup-Login/UserDetailsForm';

export default function Approutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserDetailsForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}
