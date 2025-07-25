import React, { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { Trash2, Check, X, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut } from "lucide-react";



const opcionesCDD = [
  "000 – Generalidades", "100 – Filosofía", "200 – Religión",
  "300 – Ciencias Sociales", "400 – Lenguas", "500 – Ciencias Naturales",
  "600 – Tecnología", "700 – Artes", "800 – Literatura", "900 – Historia y Geografía",
  "020 – Bibliotecología", "030 – Enciclopedias", "070 – Periodismo",
  "150 – Psicología", "170 – Ética", "330 – Economía",
  "340 – Derecho", "370 – Educación", "390 – Costumbres, etiqueta, folclor",
  "420 – Inglés y viejos ingleses", "460 – Español y portugués",
  "520 – Astronomía", "540 – Química", "570 – Biología",
  "620 – Ingeniería", "640 – Hogar", "680 – Manufactura",
  "740 – Dibujo y artes decorativas", "760 – Artes gráficas", "790 – Deportes y juegos",
  "820 – Literatura inglesa", "860 – Literatura española", "910 – Geografía y viajes",
  "930 – Historia antigua", "940 – Historia europea"
];

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [hora, setHora] = useState(new Date());
  const [editandoCampo, setEditandoCampo] = useState({ id: null, campo: null });
  const [modoOscuro, setModoOscuro] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: "", autor: "", genero: "",
    editorial: "", codigo: "", publicacion: "", disponible: true,
  });

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const obtenerLibros = async () => {
    try {
      const response = await api.get("/libros/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });

      const data = response.data;
      if (Array.isArray(data)) setLibros(data);
      else if (Array.isArray(data.results)) setLibros(data.results);
      else throw new Error("Respuesta no es una lista");
    } catch (error) {
      console.error("Error al cargar libros:", error);
      setMensajeError("Error: formato de datos inesperado.");
    }
  };

  useEffect(() => {
    obtenerLibros();
  }, []);

  const cambiarDato = (id, campo, valor) => {
    setLibros(prev =>
      prev.map(libro => libro.id === id ? { ...libro, [campo]: valor } : libro)
    );
  };

  const guardarCambios = async (id) => {
    const libro = libros.find(l => l.id === id);
    try {
      await api.put(`/libros/${id}/`, libro, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      });
      setEditandoCampo({ id: null, campo: null });
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setMensajeError("Error al guardar cambios.");
    }
  };

  const eliminarLibro = async (id) => {
    try {
      await api.delete(`/libros/${id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      });
      setLibros(prev => prev.filter(libro => libro.id !== id));
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      setMensajeError("Error al eliminar libro.");
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoLibro(prev => ({ ...prev, [name]: value }));
  };

  const agregarLibro = async () => {
    const valores = Object.values(nuevoLibro).map(v => String(v).trim());
    if (valores.some(val => val === "")) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await api.post("/libros/", nuevoLibro, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` }
      });
      setLibros(prev => [...prev, response.data]);
      setNuevoLibro({
        titulo: "", autor: "", genero: "", editorial: "",
        codigo: "", publicacion: "", disponible: true
      });
      setMensajeError("");
    } catch (error) {
      console.error("Error al agregar libro:", error);
      setMensajeError("No se pudo agregar el libro.");
    }
  };

  return (
    <div className={`flex ${modoOscuro ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <Sidebar
        hora={hora.toLocaleTimeString()}
        fecha={hora.toLocaleDateString()}
        modoOscuro={modoOscuro}
        setModoOscuro={setModoOscuro}
      />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">

  <h1 className="text-3xl font-bold flex items-center gap-2">
    <span className="text-yellow-400">📚</span> Libros Registrados
  </h1>

  <div className="flex gap-3 items-center">
    <button
      onClick={() => setModoOscuro(!modoOscuro)}
      className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      title="Cambiar modo"
    >
      {modoOscuro ? <Sun /> : <Moon />}
    </button>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
      className="p-2 rounded hover:bg-red-500 text-red-600 hover:text-white transition"
      title="Cerrar sesión"
    >
      <LogOut />
    </button>
  </div>
</div>


        {mensajeError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500 p-3 mb-4 text-white rounded shadow flex justify-between items-center"
          >
            {mensajeError}
            <button onClick={() => setMensajeError("")}>
              <XCircle className="w-5 h-5 ml-4 hover:text-gray-200 transition" />
            </button>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2">#</th>
                <th className="p-2">Título</th>
                <th className="p-2">Autor</th>
                <th className="p-2">Género</th>
                <th className="p-2">Editorial</th>
                <th className="p-2">CDD</th>
                <th className="p-2">Disponible</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.length > 0 ? libros.map((libro, index) => (
                <tr key={libro.id} className="text-center border-t border-gray-300">
                  <td className="p-2">{index + 1}</td>
                  {["titulo", "autor", "genero", "editorial"].map(campo => (
                    <td key={campo} className="p-2">
                      {editandoCampo.id === libro.id && editandoCampo.campo === campo ? (
                        <input
                          className="border rounded p-1 text-black"
                          value={libro[campo]}
                          onChange={(e) => cambiarDato(libro.id, campo, e.target.value)}
                          onBlur={() => guardarCambios(libro.id)}
                        />
                      ) : (
                        <span onClick={() => setEditandoCampo({ id: libro.id, campo })}>
                          {libro[campo] || "-"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="p-2">
                    {editandoCampo.id === libro.id && editandoCampo.campo === "codigo" ? (
                      <select
                        className="border rounded p-1 text-black"
                        value={libro.codigo}
                        onChange={(e) => cambiarDato(libro.id, "codigo", e.target.value)}
                        onBlur={() => guardarCambios(libro.id)}
                      >
                        <option value="">Seleccionar CDD</option>
                        {opcionesCDD.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    ) : (
                      <span onClick={() => setEditandoCampo({ id: libro.id, campo: "codigo" })}>
                        {libro.codigo || "-"}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {libro.disponible ? <Check className="text-green-500 inline" /> : <X className="text-red-500 inline" />}
                  </td>
                  <td className="p-2">
                    <button onClick={() => eliminarLibro(libro.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="p-4 text-center">No hay libros disponibles.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulario para agregar nuevo libro */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {["titulo", "autor", "genero", "editorial"].map(campo => (
            <input
              key={campo}
              name={campo}
              value={nuevoLibro[campo]}
              onChange={manejarCambio}
              placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
              className={`p-2 rounded border ${modoOscuro ? "bg-gray-800 text-white" : "bg-white text-black"}`}
            />
          ))}

          <select
            name="codigo"
            value={nuevoLibro.codigo}
            onChange={manejarCambio}
            className={`p-2 rounded border ${modoOscuro ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <option value="">Seleccionar CDD</option>
            {opcionesCDD.map(opcion => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>

          <input
            type="date"
            name="publicacion"
            value={nuevoLibro.publicacion}
            onChange={manejarCambio}
            className={`p-2 rounded border ${modoOscuro ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />

          <button onClick={agregarLibro} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition col-span-2 md:col-span-3">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Libros;
