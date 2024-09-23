import UserProvider from "./context/UserContext"
import Approutes from "./routes/Approutes"

function App() {
  return (
    <UserProvider>
      <Approutes />
    </UserProvider>
  )
}

export default App
