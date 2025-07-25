import React, { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const LoginView = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const params = new URLSearchParams()
      params.append('username', formData.username)
      params.append('password', formData.password)

      const response = await api.post('/login/', params)
      localStorage.setItem('token', response.data.token)
      navigate('/libros')
    } catch (err) {
      console.error(err)
      setError('Credenciales inválidas')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/fondo-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white bg-opacity-90 shadow-xl p-8 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700 flex justify-center items-center gap-2">
          <span className="text-xl">⇨</span> Inicio de Sesión
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-all"
          >
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default LoginView
