import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import Login from '../pages/Signup-Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import PageNotFound from '../pages/404-ErrorPage/PageNotFound';
import Layout from '../components/layout/Layout';
import LeadManagementIndex from '../pages/Lead-Management';
import LeadSettingIndex from '../pages/LeadSetting';
import RestApi from '../pages/LeadSetting/RestApi';
import WebFormContent from '../pages/LeadSetting/WebFormContent';
import AddPropertyForm from '../pages/Properties/AddPropertyForm';
import AllProperties from '../pages/Properties/AllProperties';
import YourProperties from '../pages/Properties/YourProperties';
import AddProperty from '../pages/Properties/AddPropertyIndex';
import useAuth from '../hooks/useAuth';
import useProperty from '../hooks/useProperty';


export default function Approutes() {
  const { authToken } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<NavigateToDashboardOrLogin />} />
      <Route path="login" element={<Login />} />
      <Route path="webform/:userId" element={<WebFormContent />} />

      {/* Routes for selecting and adding properties */}
      <Route path="properties" exact element={<YourProperties />} />
      <Route path="add-property" element={<AddProperty />} />
      <Route path="add-property-form/:schemeType" element={<AddPropertyForm />} />
      <Route path="all-properties/:propertyType" element={<AllProperties />} />

      {authToken ? (
        <Route element={<LayoutWrapper />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lead-management" element={<LeadManagementIndex />} />
          <Route path="leads-setting" element={<LeadSettingIndex />} />
          <Route path="rest-api" element={<RestApi />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}

    </Routes>
  )
}

function NavigateToDashboardOrLogin() {
  const { authToken } = useAuth();
  const { propertyId } = useProperty();
  if (!authToken) return <Login />;
  return propertyId ? <Navigate to="/dashboard" /> : <Navigate to="/add-property" />;
}


function LayoutWrapper() {
  const { propertyId } = useProperty();
  if (!propertyId) {
    return <YourProperties />;
  }
  return <Layout />;
}
