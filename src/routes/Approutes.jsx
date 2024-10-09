import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import useProperty from '../hooks/useProperty';

const Login = lazy(() => import('../pages/Signup-Login/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const PageNotFound = lazy(() => import('../pages/404-ErrorPage/PageNotFound'));
const Layout = lazy(() => import('../components/layout/Layout'));
const LeadManagementIndex = lazy(() => import('../pages/Lead-Management'));
const LeadSettingIndex = lazy(() => import('../pages/LeadSetting'));
const RestApi = lazy(() => import('../pages/LeadSetting/RestApi'));
const WebFormContent = lazy(() => import('../pages/LeadSetting/WebFormContent'));
const AddPropertyForm = lazy(() => import('../pages/Properties/AddPropertyForm'));
const AllProperties = lazy(() => import('../pages/Properties/AllProperties'));
const YourProperties = lazy(() => import('../pages/Properties/YourProperties'));
const AddProperty = lazy(() => import('../pages/Properties/AddPropertyIndex'));

export default function Approutes() {
  const { authToken } = useAuth();
  const { propertyId } = useProperty();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="webform/:userId" element={<WebFormContent />} />

        {/* Routes for selecting and adding properties */}
        <Route path="properties" element={<YourProperties />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="add-property-form/:schemeType" element={<AddPropertyForm />} />
        <Route path="all-properties/:propertyType" element={<AllProperties />} />

        {authToken && propertyId ? (
          <Route element={<Layout />}>
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
    </Suspense>
  )
}

function NavigateToDashboardOrLogin() {
  const { authToken } = useAuth();
  const { propertyId } = useProperty();
  if (!authToken) return <Login />;
  return propertyId ? <Navigate to="/dashboard" /> : <Navigate to="/properties" />;
}


function LayoutWrapper() {
  const { propertyId } = useProperty();
  if (!propertyId) {
    return <YourProperties />;
  }
  return <Layout />;
}
