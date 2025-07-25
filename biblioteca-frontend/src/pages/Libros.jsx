import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Plus, Trash2, Sun, Moon, LogOut, Bell, BookOpen, School, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'

const Libros = () => {
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [editando, setEditando] = useState(null)
  const [hora, setHora] = useState(new Date())
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: '', autor: '', genero: '', editorial: '',
    cdd: '', disponible: true, fecha_publicacion: ''
  })

  useEffect(() => {
    const fetchLibros = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await api.get('libros/', {
          headers: { Authorization: `Token ${token}` },
        })
        const data = Array.isArray(response.data) ? response.data : response.data.results || []
        setLibros(data)
      } catch (error) {
        console.error('Error al cargar libros:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibros()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleAddOrUpdateLibro = async () => {
    const token = localStorage.getItem('token')
    try {
      if (editando) {
        const response = await api.put(`libros/${editando.id}/`, nuevoLibro, {
          headers: { Authorization: `Token ${token}` },
        })
        setLibros(libros.map(libro => libro.id === editando.id ? response.data : libro))
        setEditando(null)
      } else {
        const response = await api.post('libros/', nuevoLibro, {
          headers: { Authorization: `Token ${token}` },
        })
        setLibros([...libros, response.data])
      }
      setNuevoLibro({
        titulo: '', autor: '', genero: '', editorial: '',
        cdd: '', disponible: true, fecha_publicacion: ''
      })
    } catch (error) {
      console.error('Error al guardar libro:', error)
    }
  }

  const handleDeleteLibro = async (id) => {
    const token = localStorage.getItem('token')
    try {
      await api.delete(`libros/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      setLibros(libros.filter((libro) => libro.id !== id))
    } catch (error) {
      console.error('Error al eliminar libro:', error)
    }
  }

  const handleEdit = (libro) => {
    setNuevoLibro(libro)
    setEditando(libro)
  }

  const cddOptions = [
    '000 – Generalidades', '100 – Filosofía', '200 – Religión', '300 – Ciencias Sociales',
    '400 – Lenguas', '500 – Ciencias Naturales', '600 – Tecnología', '700 – Arte y Recreación',
    '800 – Literatura', '900 – Historia y Geografía', '910 – Geografía', '920 – Biografías',
    '930 – Historia antigua', '940 – Historia europea', '950 – Historia asiática', '960 – África',
    '970 – América del Norte', '980 – América del Sur', '990 – Oceanía'
  ]

  if (loading) return <p className="text-center mt-10">Cargando libros...</p>

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} min-h-screen p-6 transition-all`}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <School size={28} className="text-blue-600 dark:text-yellow-300" />
          <div>
            <h1 className="text-2xl font-bold">Institución Educativa Álvaro Echeverry Perea</h1>
            <p className="text-sm opacity-80">{hora.toLocaleDateString()} - {hora.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 shadow"><Bell size={18} /></button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }} className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"><LogOut size={18} /></button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 grid md:grid-cols-7 gap-2">
        {['titulo', 'autor', 'genero', 'editorial'].map((field) => (
          <input key={field} type="text" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="p-2 rounded border bg-gray-200 text-black dark:bg-gray-700 dark:text-white" value={nuevoLibro[field]} onChange={(e) => setNuevoLibro({ ...nuevoLibro, [field]: e.target.value })} />
        ))}
        <select className="p-2 rounded border bg-gray-200 text-black dark:bg-gray-700 dark:text-white" value={nuevoLibro.cdd} onChange={(e) => setNuevoLibro({ ...nuevoLibro, cdd: e.target.value })}>
          <option value="">CDD</option>
          {cddOptions.map((cdd, i) => <option key={i} value={cdd}>{cdd}</option>)}
        </select>
        <input type="date" className="p-2 rounded border bg-gray-200 text-black dark:bg-gray-700 dark:text-white" value={nuevoLibro.fecha_publicacion} onChange={(e) => setNuevoLibro({ ...nuevoLibro, fecha_publicacion: e.target.value })} />
        <button onClick={handleAddOrUpdateLibro} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2 col-span-full md:col-span-1">
          <Plus size={16} /> {editando ? 'Actualizar' : 'Agregar'}
        </button>
      </motion.div>

      {libros.length === 0 ? (
        <div className="text-center py-12 opacity-70">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <BookOpen size={48} className="mx-auto text-blue-400" />
            <p className="text-xl font-semibold mt-4">Ups... aún no hay libros registrados</p>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Título</th>
                <th className="p-2 border">Autor</th>
                <th className="p-2 border">Género</th>
                <th className="p-2 border">Editorial</th>
                <th className="p-2 border">CDD</th>
                <th className="p-2 border">Publicación</th>
                <th className="p-2 border">Disponible</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro, index) => (
                <motion.tr key={libro.id} className="bg-white dark:bg-gray-800 hover:scale-[101%] transition-transform">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{libro.titulo}</td>
                  <td className="p-2 border">{libro.autor}</td>
                  <td className="p-2 border">{libro.genero}</td>
                  <td className="p-2 border">{libro.editorial}</td>
                  <td className="p-2 border">{libro.cdd || '-'}</td>
                  <td className="p-2 border text-center">{libro.fecha_publicacion || '-'}</td>
                  <td className="p-2 border text-center">{libro.disponible ? '✅' : '❌'}</td>
                  <td className="p-2 border text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(libro)} className="text-blue-500 hover:text-blue-700"><Edit3 size={18} /></button>
                    <button onClick={() => handleDeleteLibro(libro.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}

export default Libros
