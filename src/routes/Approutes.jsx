import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import useProperty from '../hooks/useProperty';

const Login = lazy(() => import('../pages/Signup-Login/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const PageNotFound = lazy(() => import('../pages/404-ErrorPage/PageNotFound'));
const Layout = lazy(() => import('../components/layout/Layout'));
const LeadManagementIndex = lazy(() => import('../pages/Lead-Management'));
const RestApi = lazy(() => import('../pages/LeadSetting/RestApi'));
const WebFormContent = lazy(() => import('../pages/LeadSetting/WebFormContent'));
const AllProperties = lazy(() => import('../pages/Properties/AllProperties'));
const AddProperty = lazy(() => import('../pages/Properties/AddPropertyIndex'));

export default function Approutes() {
  const { authToken } = useAuth();
  const { schemeId } = useProperty();
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <Routes>
        <Route path="/" element={<NavigateToDashboardOrLogin />} />
        <Route path="login" element={<Login />} />
        <Route path="webform/:schemeId" element={<WebFormContent />} />

        {authToken ? (
          <>
            <Route path="schemes" element={<AllProperties />} />
            <Route path="add-scheme" element={<AddProperty />} />

            {schemeId && (
              <Route element={<LayoutWrapper />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="lead-management" element={<LeadManagementIndex />} />
                <Route path="rest-api" element={<RestApi />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}

      </Routes>
    </Suspense>
  )
}

function NavigateToDashboardOrLogin() {
  const { authToken } = useAuth();
  const { schemeId } = useProperty();
  if (!authToken) return <Navigate to="/" />;
  return schemeId ? <Navigate to="/dashboard" /> : <Navigate to="/schemes" />;
}


function LayoutWrapper() {
  const { schemeId } = useProperty();
  if (!schemeId) {
    return <Navigate to="/schemes" />;
  }
  return <Layout />;
}
