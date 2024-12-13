import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import useProperty from '../hooks/useProperty';
import Login from '../pages/Signup-Login/Login';

const PageNotFound = lazy(() => import('../pages/404-ErrorPage/PageNotFound'));
const Layout = lazy(() => import('../components/layout/Layout'));
const RestApi = lazy(() => import('../pages/LeadSetting/RestApi'));
const WebFormContent = lazy(() => import('../pages/LeadSetting/WebFormContent'));
const AllProperties = lazy(() => import('../pages/Properties/AllProperties'));
const AddProperty = lazy(() => import('../pages/Properties/AddPropertyIndex'));
const AllLeads = lazy(() => import('../pages/Lead-Management/AllLeads'));
const LeadSettingIndex = lazy(() => import('../pages/LeadSetting'));
const UploadCsv = lazy(() => import('../pages/Lead-Management/UploadCsv'));
const Sales = lazy(() => import('../pages/Sales/Sales'));
const AddWings = lazy(() => import('../pages/Sales/AddWings'));
const CustomFields = lazy(() => import('../pages/Lead-Management/CustomFields/CustomFields'));
const AddUpdateLeadForm = lazy(() => import('../pages/Lead-Management/AddUpdateLeadForm'));


export default function Approutes() {
  const { authToken } = useAuth();
  const { schemeId } = useProperty();
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <Routes>
        <Route path="/" element={<NavigateToOrLogin />} />
        <Route path="login" element={<Login />} />
        <Route path="webform/:schemeId" element={<WebFormContent />} />

        {authToken ? (
          <>
            <Route path="schemes" element={<AllProperties />} />
            <Route path="add-scheme" element={<AddProperty />} />

            {schemeId && (
              <Route element={<LayoutWrapper />}>
                <Route path="/" element={<Sales />} />
                <Route path="sales" element={<Sales />} />
                <Route path="add-wings" element={<AddWings />} />

                {/* leads pages */}
                <Route path="all-leads" element={<AllLeads />} />
                <Route path="lead-setting" element={<LeadSettingIndex />} />
                <Route path="upload-csv" element={<UploadCsv />} />
                <Route path="rest-api" element={<RestApi />} />
                <Route path="custom-fields" element={<CustomFields />} />
                <Route path="add-update-leads" element={<AddUpdateLeadForm />} />

                <Route path="*" element={<PageNotFound />} />
              </Route>
            )}
          </>
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}

      </Routes>
    </Suspense>
  )
}

function NavigateToOrLogin() {
  const { authToken } = useAuth();
  const { schemeId } = useProperty();
  if (!authToken) return <Navigate to="/" />;
  return schemeId ? <Navigate to="/sales" /> : <Navigate to="/schemes" />;
}


function LayoutWrapper() {
  const { schemeId } = useProperty();
  if (!schemeId) {
    return <Navigate to="/schemes" />;
  }
  return <Layout />;
}
