import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

// Mapa de dependencias con nombres amigables para el usuario
const dependencias = {
    pais: [
    { endpoint: (id) => `/estados/pais/${id}`, label: 'Estados', campo: (r) => r.nombre },
],
    estado: [
    { endpoint: (id) => `/ciudades/estado/${id}`, label: 'Ciudades', campo: (r) => r.nombre },
],
    ciudad: [
    { endpoint: (id) => `/colonias/ciudad/${id}`, label: 'Colonias', campo: (r) => r.nombre },
],
    colonia: [
    { endpoint: (id) => `/calles/colonia/${id}`, label: 'Calles', campo: (r) => r.nombre },
],
    especie: [
    { endpoint: (id) => `/razas/especie/${id}`, label: 'Razas', campo: (r) => r.nombre },
],
    raza: [
    { endpoint: (id) => `/mascotas/sucursal/${id}`, label: 'Mascotas', campo: (r) => r.nombre },
],
    rol: [
    { endpoint: (id) => `/usuarios/rol/${id}`, label: 'Usuarios', campo: (r) => `${r.nombre} ${r.paterno}` },
],
    gestor: [
    { endpoint: (id) => `/sucursales/gestor/${id}`, label: 'Sucursales', campo: (r) => r.nombre },
],
    sucursal: [
    { endpoint: (id) => `/mascotas/sucursal/${id}`, label: 'Mascotas', campo: (r) => r.nombre },
    { endpoint: (id) => `/citas/sucursal/${id}`, label: 'Citas', campo: (r) => `Cita #${r.idCita} (${r.fecha})` },
],
    usuario: [
    { endpoint: (id) => `/mascotas/usuario/${id}`, label: 'Mascotas', campo: (r) => r.nombre },
    { endpoint: (id) => `/citas/usuario/${id}`, label: 'Citas', campo: (r) => `Cita #${r.idCita} (${r.fecha})` },
],
    mascota: [
    { endpoint: (id) => `/citas/mascota/${id}`, label: 'Citas', campo: (r) => `Cita #${r.idCita} (${r.fecha})` },
],
    cita: [
    { endpoint: (id) => `/consultas/cita/${id}`, label: 'Consultas médicas', campo: (r) => `Consulta #${r.idVisita}` },
    { endpoint: (id) => `/cita-servicios/cita/${id}`, label: 'Servicios de cita', campo: (r) => r.servicio?.nombre || `Servicio #${r.idServicio}` },
],
}

export function useEliminar(entidad) {
    const [verificando, setVerificando] = useState({})
    const [hijos, setHijos] = useState({})

    const verificarHijos = async (id) => {
        const deps = dependencias[entidad]
        if (!deps) return

        setVerificando(prev => ({ ...prev, [id]: true }))
        const grupos = []

        for (const dep of deps) {
            try {
                const res = await api.get(dep.endpoint(id))
                
                // --- CAMBIO AQUÍ ---
                let registros = []
                if (Array.isArray(res.data)) {
                    registros = res.data // Caso Sucursales (Ya es array)
                } else if (res.data && typeof res.data === 'object' && Object.keys(res.data).length > 0) {
                    registros = [res.data] // Caso Gestores (Convertimos objeto a array de 1 elemento)
                }
                // --------------------

                if (registros.length > 0) {
                    grupos.push({
                        label: dep.label,
                        // dep.campo(r) funcionará para ambos casos ahora
                        registros: registros.map(r => dep.campo(r)),
                    })
                }
            } catch {
                // Si falla la verificacion, se ignora ese grupo
            }
        }

        setHijos(prev => ({
            ...prev,
            [id]: grupos,
        }))

        setVerificando(prev => ({ ...prev, [id]: false }))
    }

  // true si tiene al menos un grupo con registros
    const tieneHijos = (id) =>
    Array.isArray(hijos[id]) && hijos[id].length > 0

  // Devuelve la info completa de hijos para mostrar en el modal
    const detalleHijos = (id) => hijos[id] || []

    return { verificarHijos, tieneHijos, detalleHijos, verificando }
}