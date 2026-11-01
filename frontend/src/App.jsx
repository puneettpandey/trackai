import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GroupMapPage from './pages/GroupMapPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import { LoginPage, RegisterPage } from './pages/AuthPages.jsx'
import NearbyPage from './pages/NearbyPage.jsx'
import SafetyPage from './pages/SafetyPage.jsx'

function ProtectedLayout() {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-8 text-sm text-slate-500">Checking your account…</p>
  return user ? <AppShell /> : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-8 text-sm text-slate-500">Checking your account…</p>
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/group-map" element={<GroupMapPage />} />
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/safety" element={<SafetyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>
}
