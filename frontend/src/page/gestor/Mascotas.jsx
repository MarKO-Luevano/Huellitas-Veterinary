import { useEffect, useState } from 'react'
import api from '../../api/axios'

const formInicial = {
  nombre: '',
  fechaNacimiento: '',
  peso: '',
  estatus: 1,
  razaId: '',
  usuarioId: '',
  sucursalId: '',
}

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([])
  const [clientes, setClientes] = useState([])
  const [razas, setRazas] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formInicial)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [m, c, r, s] = await Promise.all([
        api.get('/mascotas'),
        api.get('/usuarios/rol/4'),
        api.get('/razas'),
        api.get('/sucursales'),
      ])
      setMascotas(m.data)
      setClientes(c.data)
      setRazas(r.data)
      setSucursales(s.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarDatos() }, [])

  const abrirCrear = () => {
    setEditando(null)
    setForm(formInicial)
    setError('')
    setExito('')
    setShowModal(true)
  }

  const abrirEditar = (mascota) => {
    setEditando(mascota)
    setForm({
      nombre: mascota.nombre || '',
      fechaNacimiento: mascota.fechaNacimiento || '',
      peso: mascota.peso || '',
      estatus: mascota.estatus ?? 1,
      razaId: mascota.raza?.idRaza || '',
      usuarioId: mascota.usuario?.idUsuario || '',
      sucursalId: mascota.sucursal?.idSucursal || '',
    })
    setError('')
    setExito('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    try {
      const payload = {
        nombre: form.nombre,
        fechaNacimiento: form.fechaNacimiento,
        peso: parseFloat(form.peso),
        estatus: parseInt(form.estatus),
        raza: { idRaza: parseInt(form.razaId) },
        usuario: { idUsuario: parseInt(form.usuarioId) },
        sucursal: { idSucursal: parseInt(form.sucursalId) },
      }
      if (editando) {
        await api.put(`/mascotas/${editando.idMascota}`, payload)
        setExito('Mascota actualizada correctamente')
      } else {
        await api.post('/mascotas', payload)
        setExito('Mascota registrada correctamente')
      }
      cargarDatos()
      setTimeout(() => setShowModal(false), 1000)
    } catch (err) {
      setError('Error al guardar la mascota')
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta mascota?')) return
    try {
      await api.delete(`/mascotas/${id}`)
      cargarDatos()
    } catch (err) {
      alert('No se pudo eliminar la mascota')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🐾 Mascotas</h2>
        <button
          onClick={abrirCrear}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
        >
          + Nueva Mascota
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Raza</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dueño</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Peso</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estatus</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mascotas.map((m) => (
                <tr key={m.idMascota} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{m.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{m.raza?.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {m.usuario?.nombre} {m.usuario?.paterno}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{m.peso} kg</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      m.estatus === 1
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {m.estatus === 1 ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => abrirEditar(m)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(m.idMascota)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {mascotas.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay mascotas registradas</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editando ? 'Editar Mascota' : 'Nueva Mascota'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.peso}
                    onChange={e => setForm({ ...form, peso: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                  <select
                    value={form.razaId}
                    onChange={e => setForm({ ...form, razaId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una raza</option>
                    {razas.map(r => (
                      <option key={r.idRaza} value={r.idRaza}>
                        {r.nombre} ({r.especie?.nombre})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dueño (Cliente)</label>
                  <select
                    value={form.usuarioId}
                    onChange={e => setForm({ ...form, usuarioId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(c => (
                      <option key={c.idUsuario} value={c.idUsuario}>
                        {c.nombre} {c.paterno}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal</label>
                  <select
                    value={form.sucursalId}
                    onChange={e => setForm({ ...form, sucursalId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una sucursal</option>
                    {sucursales.map(s => (
                      <option key={s.idSucursal} value={s.idSucursal}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                  <select
                    value={form.estatus}
                    onChange={e => setForm({ ...form, estatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Activa</option>
                    <option value={0}>Inactiva</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
              {exito && <p className="text-green-600 text-sm">✅ {exito}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
                >
                  {editando ? 'Actualizar' : 'Registrar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}