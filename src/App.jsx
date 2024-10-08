import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { PropertyProvider } from "./context/PropertyContext"
import Approutes from "./routes/Approutes"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <Approutes />
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
