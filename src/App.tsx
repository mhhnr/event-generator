import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthForm } from './components/AuthForm'
import { HomePage } from './components/HomePage'
import { Dashboard } from './components/Dashboard'
import { CreateEventPage } from './pages/CreateEventPage'
import { PublicEventPage } from './pages/PublicEventPage'

function LoginPage() {
  return <AuthForm mode="login" />
}

function SignupPage() {
  return <AuthForm mode="signup" />
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          } />
          <Route path="/event/:slug" element={<PublicEventPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}