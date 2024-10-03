import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from '../pages/Signup-Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoutes from './PrivateRoutes';
import PageNotFound from '../pages/404-ErrorPage/PageNotFound';
import Layout from '../components/layout/Layout';
import LeadManagementIndex from '../pages/Lead-Management';
import LeadSettingIndex from '../pages/LeadSetting';
import RestApi from '../pages/LeadSetting/RestApi';
import WebFormContent from '../pages/LeadSetting/WebFormContent';
import Properties from '../pages/Properties';
import AddPropertyForm from '../pages/Properties/AddPropertyForm';
import AddPropertyIndex from '../pages/Properties/AddPropertyIndex';
import Cookies from 'js-cookie';

export default function Approutes() {
  const token = Cookies.get('authToken');
  const propertyId = Cookies.get('propertyId');
  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/webform/:userId" element={<WebFormContent />} />

        <Route path="/properties" element={propertyId ? <Properties /> : <Navigate to="/" />} />
        <Route path="/add-property-scheme" element={propertyId ? <AddPropertyIndex /> : <Navigate to="/login" />} />
        <Route path="/add-properties/:schemeType" element={propertyId ? <AddPropertyForm /> : <Navigate to="/" />} />

        <Route element={<PrivateRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lead-management" element={<LeadManagementIndex />} />
            <Route path="/leads-setting" element={<LeadSettingIndex />} />
            <Route path="/rest-api" element={<RestApi />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}
