import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages (we will create these next)
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'

// Contexts
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App