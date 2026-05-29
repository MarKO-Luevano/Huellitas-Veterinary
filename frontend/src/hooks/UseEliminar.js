import { useState } from "react";
import axios from "axios";

export function useEliminar(url, onSuccess) {
  const [cargando, setCargando] = useState(false);
  const [hijos, setHijos] = useState({});

  const verificarHijos = async (id) => {
    try {
      const res = await axios.get(`${url}/${id}/hijos`);
      setHijos(prev => ({ ...prev, [id]: res.data }));
    } catch {
      setHijos(prev => ({ ...prev, [id]: [] }));
    }
  };

  const tieneHijos = (id) => {
    const h = hijos[id];
    return Array.isArray(h) ? h.length > 0 : false;
  };

  const detalleHijos = (id) => hijos[id] || [];

  const verificando = {};

  const eliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este registro?");
    if (!confirmar) return;
    setCargando(true);
    try {
      await axios.delete(`${id}`);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al eliminar.");
    } finally {
      setCargando(false);
    }
  };

  return { eliminar, cargando, verificarHijos, tieneHijos, detalleHijos, verificando };
}
