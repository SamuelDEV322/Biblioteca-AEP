// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Book, Clock4, Users2, BarChart2, Library } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fechaFormateada = hora.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaFormateada = hora.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <aside className="bg-gray-100 dark:bg-gray-800 w-64 min-h-screen p-4 flex flex-col shadow-md">
      <div className="text-center mb-6">
        <div className="text-xl font-bold flex items-center justify-center gap-2 text-blue-800 dark:text-blue-300">
          <Library className="w-6 h-6" />
          Biblioteca Escolar AEP
        </div>
      </div>

      <div className="mb-6 text-center text-gray-800 dark:text-gray-100">
        <div className="text-lg font-semibold">{horaFormateada}</div>
        <div className="text-sm">{fechaFormateada}</div>
      </div>

      <nav className="flex flex-col gap-4 mt-4">
        <Link
          to="/libros"
          className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
        >
          <Book size={18} />
          Libros
        </Link>
        <Link
          to="/prestamos"
          className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
        >
          <Clock4 size={18} />
          Préstamos
        </Link>
        <Link
          to="/recomendaciones"
          className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
        >
          <Users2 size={18} />
          Recomendaciones
        </Link>
        <Link
          to="/reportes"
          className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
        >
          <BarChart2 size={18} />
          Reportes
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
