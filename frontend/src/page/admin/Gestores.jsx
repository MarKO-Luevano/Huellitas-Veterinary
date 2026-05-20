import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useEliminar } from '../../hooks/UseEliminar'
import BotonEliminar from '../../components/BotonEliminar' 

const formInicial = {
  nombre: '', paterno: '', materno: '',
  correo: '', password: '', telefono: '',
  activo: 'true', rfc: '', salario: '',
}

export default function Gestores() {
  const [gestores, setGestores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formInicial)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)
  const { verificarHijos, tieneHijos, detalleHijos, verificando } = useEliminar('gestor');

  const cargarDatos = async () => {
    setLoading(true)
    try {
      // Pedimos los gestores a la API
      const res = await api.get('/gestores')
      setGestores(res.data)
      
      res.data.forEach(gestor => {
        if (gestor.idGestor) {
          verificarHijos(gestor.idGestor)
        }
      })
      
    } catch (err) {
      console.error("Error cargando gestores:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    cargarDatos() 
  }, [])

  const abrirCrear = () => {
    setEditando(null)
    setForm(formInicial)
    setError(''); setExito('')
    setShowModal(true)
  }

  const abrirEditar = (gestor) => {
    setEditando(gestor)
    setForm({
      nombre: gestor.usuario?.nombre || '',
      paterno: gestor.usuario?.paterno || '',
      materno: gestor.usuario?.materno || '',
      correo: gestor.usuario?.correo || '',
      password: gestor.usuario?.password || '',
      telefono: gestor.usuario?.telefono || '',
      activo: gestor.usuario?.activo || 'true',
      rfc: gestor.rfc || '',
      salario: gestor.salario || '',
    })
    setError(''); setExito('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setExito(''); setGuardando(true)
    try {
      // 1. Crear o actualizar usuario con rol gestor (id 2)
      const usuarioPayload = {
        nombre: form.nombre,
        paterno: form.paterno,
        materno: form.materno,
        correo: form.correo,
        password: form.password,
        telefono: form.telefono,
        activo: form.activo,
        rol: { idRol: 2 },
        fechaRegistro: new Date().toISOString(),
      }

      let usuarioId
      if (editando) {
        await api.put(`/usuarios/${editando.usuario.idUsuario}`, usuarioPayload)
        usuarioId = editando.usuario.idUsuario
      } else {
        const resUsuario = await api.post('/usuarios', usuarioPayload)
        usuarioId = resUsuario.data.idUsuario
      }

      // 2. Crear o actualizar gestor
      const gestorPayload = {
        rfc: form.rfc,
        salario: parseFloat(form.salario),
        usuario: { idUsuario: usuarioId },
      }

      if (editando) {
        await api.put(`/gestores/${editando.idGestor}`, gestorPayload)
        setExito('Gestor actualizado correctamente')
      } else {
        await api.post('/gestores', gestorPayload)
        setExito('Gestor registrado correctamente')
      }

      cargarGestores()
      setTimeout(() => setShowModal(false), 1000)
    } catch (err) {
      setError('Error al guardar el gestor')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id) => { // Recibimos el ID directamente del BotonEliminar
    if (!confirm('¿Seguro que deseas eliminar este gestor?')) return
    try {
      await api.delete(`/gestores/${id}`)
      cargarGestores()
    } catch (err) {
      alert('No se pudo eliminar el gestor. Verifique si tiene dependencias.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👤 Gestores</h2>
        <button
          onClick={abrirCrear}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
        >
          + Nuevo Gestor
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Correo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">RFC</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Salario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estatus</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gestores.map((g) => (
                <tr key={g.idGestor} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {g.usuario?.nombre} {g.usuario?.paterno}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.usuario?.correo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.rfc}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${g.salario}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      g.usuario?.activo === 'true' || g.usuario?.activo === '1'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {g.usuario?.activo === 'true' || g.usuario?.activo === '1' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => abrirEditar(g)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg"
                    >
                      Editar
                    </button>
                    
                    {/* 3. CAMBIO CLAVE: Usar BotonEliminar igual que en Sucursales */}
                    <BotonEliminar 
                      id={g.idGestor} 
                      tieneHijos={tieneHijos(String(g.idGestor))} 
                      detalleHijos={detalleHijos(String(g.idGestor))} 
                      verificando={verificando[String(g.idGestor)]} 
                      onEliminar={() => eliminar(g.idGestor)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {gestores.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay gestores registrados</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editando ? 'Editar Gestor' : 'Nuevo Gestor'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3">Datos Personales</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['nombre', 'paterno', 'materno', 'telefono'].map(key => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                      <input
                        type="text"
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        required={key === 'nombre' || key === 'paterno'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input
                      type="email"
                      value={form.correo}
                      onChange={e => setForm({ ...form, correo: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="text"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required={!editando}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                    <select
                      value={form.activo}
                      onChange={e => setForm({ ...form, activo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3">Datos de Gestor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
                    <input
                      type="text"
                      value={form.rfc}
                      onChange={e => setForm({ ...form, rfc: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salario</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.salario}
                      onChange={e => setForm({ ...form, salario: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
              {exito && <p className="text-green-600 text-sm">✅ {exito}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Registrar'}
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