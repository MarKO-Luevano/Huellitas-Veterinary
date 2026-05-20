import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useEliminar } from '../../hooks/UseEliminar'
import BotonEliminar from '../../components/BotonEliminar' 

const formInicial = {
  nombre: '', paterno: '', materno: '',
  correo: '', password: '', telefono: '',
  activo: 'true'
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formInicial)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  // 1. Inicializar el hook para la entidad 'usuario'
  const { verificarHijos, tieneHijos, detalleHijos, verificando } = useEliminar('usuario')

  const cargarClientes = async () => {
    setLoading(true)
    try {
      const res = await api.get('/usuarios/rol/4')
      setClientes(res.data)
      
      // 2. Verificar dependencias (Mascotas, Citas) para cada cliente cargado
      res.data.forEach(cliente => {
        if (cliente.idUsuario) {
          verificarHijos(cliente.idUsuario)
        }
      })
    } catch (err) {
      console.error("Error cargando clientes:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarClientes() }, [])

  const abrirCrear = () => {
    setEditando(null)
    setForm(formInicial)
    setError(''); setExito('')
    setShowModal(true)
  }

  const abrirEditar = (cliente) => {
    setEditando(cliente)
    setForm({
      nombre: cliente.nombre || '',
      paterno: cliente.paterno || '',
      materno: cliente.materno || '',
      correo: cliente.correo || '',
      password: cliente.password || '',
      telefono: cliente.telefono || '',
      activo: cliente.activo || 'true',
      edad: cliente.edad || '',
    })
    setError(''); setExito('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setExito(''); setGuardando(true)
    try {
      const payload = {
        ...form,
        rol: { idRol: 4 },
        fechaRegistro: new Date().toISOString(),
      }
      
      if (editando) {
        await api.put(`/usuarios/${editando.idUsuario}`, payload)
        setExito('Cliente actualizado correctamente')
      } else {
        await api.post('/usuarios', payload)
        setExito('Cliente registrado correctamente')
      }
      
      cargarClientes()
      setTimeout(() => setShowModal(false), 1000)
    } catch (err) {
      setError('Error al guardar el cliente')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`)
      cargarClientes()
    } catch (err) {
      alert('No se pudo eliminar el cliente. Verifique si tiene mascotas o citas activas.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Clientes</h2>
        <button
          onClick={abrirCrear}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
        >
          + Nuevo Cliente
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estatus</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((c) => (
                <tr key={c.idUsuario} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {c.nombre} {c.paterno} {c.materno} {c.edad ? `(${c.edad} años)` : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.correo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.telefono}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.edad ? `(${c.edad} años)` : 'Cliente'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.activo === 'true' || c.activo === '1'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {c.activo === 'true' || c.activo === '1' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => abrirEditar(c)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Editar
                    </button>

                    {/* 3. Implementación del Botón Inteligente */}
                    <BotonEliminar 
                      id={c.idUsuario} 
                      tieneHijos={tieneHijos(c.idUsuario)} 
                      detalleHijos={detalleHijos(c.idUsuario)} 
                      verificando={verificando[c.idUsuario]} 
                      onEliminar={() => eliminar(c.idUsuario)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clientes.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay clientes registrados</p>
          )}
        </div>
      )}

      {/* El modal se mantiene igual, solo añadí el prop disabled={guardando} al botón */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editando ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {['nombre', 'paterno', 'materno', 'telefono', 'correo', 'password', 'edad'].map(field => (
                  <div key={field} className={field === 'correo' || field === 'password' ? 'col-span-1' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field === 'paterno' ? 'Apellido Paterno' : field === 'materno' ? 'Apellido Materno' : field === 'edad' ? 'Edad' : field}
                    </label>
                    <input
                      type={field === 'password' ? 'text' : field === 'correo' ? 'email' : 'text'}
                      value={form[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      required={field !== 'materno' && (field !== 'password' || !editando)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
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