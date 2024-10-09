import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import useProperty from '../hooks/useProperty';
import ShowLoader from '../components/loader/ShowLoader';

const Login = lazy(() => import('../pages/Signup-Login/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const PageNotFound = lazy(() => import('../pages/404-ErrorPage/PageNotFound'));
const Layout = lazy(() => import('../components/layout/Layout'));
const LeadManagementIndex = lazy(() => import('../pages/Lead-Management'));
const LeadSettingIndex = lazy(() => import('../pages/LeadSetting'));
const RestApi = lazy(() => import('../pages/LeadSetting/RestApi'));
const WebFormContent = lazy(() => import('../pages/LeadSetting/WebFormContent'));
const AllProperties = lazy(() => import('../pages/Properties/AllProperties'));
const AddProperty = lazy(() => import('../pages/Properties/AddPropertyIndex'));

export default function Approutes() {
  const { authToken } = useAuth();
  const { propertyId } = useProperty();
  return (
    <Suspense fallback={<ShowLoader />}>
      <Routes>
        <Route path="/" element={<NavigateToDashboardOrLogin />} />
        <Route path="login" element={<Login />} />
        <Route path="webform/:userId" element={<WebFormContent />} />
        <Route path="*" element={<PageNotFound />} />

        {authToken ? (
          <>
            <Route path="properties" element={<AllProperties />} />
            <Route path="add-property" element={<AddProperty />} />

            {propertyId && (
              <Route element={<LayoutWrapper />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="lead-management" element={<LeadManagementIndex />} />
                <Route path="leads-setting" element={<LeadSettingIndex />} />
                <Route path="rest-api" element={<RestApi />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            )}
          </>
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
  if (!authToken) return <Navigate to="/" />;
  return propertyId ? <Navigate to="/dashboard" /> : <Navigate to="/properties" />;
}


function LayoutWrapper() {
  const { propertyId } = useProperty();
  if (!propertyId) {
    return <Navigate to="/properties" />;
  }
  return <Layout />;
}
