import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { PropertyProvider } from "./context/PropertyContext"
import Approutes from "./routes/Approutes"
import WebFormContent from "./pages/LeadSetting/WebFormContent"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="webform/:schemeId/:userid" element={<WebFormContent />} />
        <Route
          path="*"
          element={
            <AuthProvider>
              <PropertyProvider>
                <Approutes />
              </PropertyProvider>
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
