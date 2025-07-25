import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/LoginView'
import Libros from './pages/Libros'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/libros"
          element={
            <ProtectedRoute>
              <Libros />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
