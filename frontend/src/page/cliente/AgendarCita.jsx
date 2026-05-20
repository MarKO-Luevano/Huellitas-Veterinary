import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

// Función auxiliar para normalizar la fecha antes de enviarla
// Convierte "2026-04-19" -> "2026-04-19T06:00:00.000Z"
const normalizarFechaParaBackend = (fechaStr) => {
  if (!fechaStr) return null
  return `${fechaStr}T06:00:00.000Z`
}

// Función para mostrar la fecha en la tabla (la misma que usas en el Gestor)
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A'
  const fecha = new Date(fechaISO)
  const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000)
  return fechaLocal.toLocaleDateString('es-MX')
}

export default function AgendarCita() {
  const { user } = useAuth()
  const [mascotas, setMascotas] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [citas, setCitas] = useState([])
  const [form, setForm] = useState({ mascotaId: '', sucursalId: '', fecha: '' })
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      api.get(`/mascotas/usuario/${user.id}`),
      api.get('/sucursales'),
      api.get(`/citas/usuario/${user.id}`),
    ]).then(([m, s, c]) => {
      setMascotas(m.data)
      setSucursales(s.data)
      setCitas(c.data)
    }).catch(err => console.error(err))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')
    try {
      // NORMALIZACIÓN AQUÍ
      const fechaNormalizada = normalizarFechaParaBackend(form.fecha)

      await api.post('/citas', {
        fecha: fechaNormalizada, // Se envía con T06:00:00.000Z
        estadoCita: 'pendiente',
        mascota: { idMascota: parseInt(form.mascotaId) },
        sucursal: { idSucursal: parseInt(form.sucursalId) },
        usuario: { idUsuario: user.id },
      })
      
      setMensaje('✅ Cita agendada correctamente')
      setForm({ mascotaId: '', sucursalId: '', fecha: '' })
      
      // Recargar lista
      const res = await api.get(`/citas/usuario/${user.id}`)
      setCitas(res.data)
    } catch (err) {
      setMensaje('❌ Error al agendar la cita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Mis Citas</h2>

      {/* Formulario agendar */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Agendar nueva cita</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mascota</label>
            <select
              value={form.mascotaId}
              onChange={(e) => setForm({ ...form, mascotaId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una mascota</option>
              {mascotas.map(m => (
                <option key={m.idMascota} value={m.idMascota}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
            <select
              value={form.sucursalId}
              onChange={(e) => setForm({ ...form, sucursalId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una sucursal</option>
              {sucursales.map(s => (
                <option key={s.idSucursal} value={s.idSucursal}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
              min={new Date().toLocaleDateString('sv-SE')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Agendando...' : 'Agendar Cita'}
            </button>
            {mensaje && (
              <p className={`mt-2 text-sm ${mensaje.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {mensaje}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Lista de citas */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Mascota</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Sucursal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {citas.map((c) => (
              <tr key={c.idCita} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {/* USAR FORMATEO AQUÍ PARA LA TABLA */}
                  {formatearFecha(c.fecha)}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{c.mascota?.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.sucursal?.nombre}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.estadoCita === 'completada' ? 'bg-green-100 text-green-700' :
                    c.estadoCita === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                    c.estadoCita === 'cancelada' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {c.estadoCita}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {citas.length === 0 && (
          <p className="text-center text-gray-400 py-8">No tienes citas registradas</p>
        )}
      </div>
    </div>
  )
}