import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useEliminar } from '../../hooks/UseEliminar'
import BotonEliminar from '../../components/BotonEliminar' 

const formInicial = {
  nombre: '', gestorId: '',
  paisId: '', estadoId: '', ciudadId: '',
  coloniaId: '', calleId: '', numero: '',
}

export default function Sucursales() {
  const [sucursales, setSucursales] = useState([])
  const [gestores, setGestores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formInicial)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [paises, setPaises] = useState([])
  const [estados, setEstados] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [colonias, setColonias] = useState([])
  const [calles, setCalles] = useState([])
  const { verificarHijos, tieneHijos, detalleHijos, verificando } = useEliminar('sucursal', []);

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [s, g, p] = await Promise.all([
        api.get('/sucursales'),
        api.get('/gestores'),
        api.get('/paises'),
      ])
      setSucursales(s.data)
      setGestores(g.data)
      setPaises(p.data)
      s.data.forEach(sucursal => verificarHijos(sucursal.idSucursal))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarDatos() }, [])

  useEffect(() => {
    if (!form.paisId) { setEstados([]); return }
    api.get(`/estados/pais/${form.paisId}`).then(res => setEstados(res.data))
    setForm(f => ({ ...f, estadoId: '', ciudadId: '', coloniaId: '', calleId: '' }))
    setCiudades([]); setColonias([]); setCalles([])
  }, [form.paisId])

  useEffect(() => {
    if (!form.estadoId) { setCiudades([]); return }
    api.get(`/ciudades/estado/${form.estadoId}`).then(res => setCiudades(res.data))
    setForm(f => ({ ...f, ciudadId: '', coloniaId: '', calleId: '' }))
    setColonias([]); setCalles([])
  }, [form.estadoId])

  useEffect(() => {
    if (!form.ciudadId) { setColonias([]); return }
    api.get(`/colonias/ciudad/${form.ciudadId}`).then(res => setColonias(res.data))
    setForm(f => ({ ...f, coloniaId: '', calleId: '' }))
    setCalles([])
  }, [form.ciudadId])

  useEffect(() => {
    if (!form.coloniaId) { setCalles([]); return }
    api.get(`/calles/colonia/${form.coloniaId}`).then(res => setCalles(res.data))
    setForm(f => ({ ...f, calleId: '' }))
  }, [form.coloniaId])

  const abrirCrear = () => {
    setEditando(null)
    setForm(formInicial)
    setEstados([]); setCiudades([]); setColonias([]); setCalles([])
    setError(''); setExito('')
    setShowModal(true)
  }

  const abrirEditar = (sucursal) => {
    setEditando(sucursal)
    setForm({
      nombre: sucursal.nombre || '',
      gestorId: sucursal.gestor?.idGestor || '',
      paisId: '', estadoId: '', ciudadId: '',
      coloniaId: '', calleId: '',
      numero: sucursal.direccion?.numero || '',
    })
    setError(''); setExito('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setExito(''); setGuardando(true)
    try {
      let direccionId = editando?.direccion?.idDireccion || null

      if (form.calleId && form.numero) {
        const resDireccion = await api.post('/direcciones', {
          numero: form.numero,
          calle: { idCalle: parseInt(form.calleId) },
        })
        direccionId = resDireccion.data.idDireccion
      }

      const payload = {
        nombre: form.nombre,
        gestor: { idGestor: parseInt(form.gestorId) },
        ...(direccionId && { direccion: { idDireccion: direccionId } }),
      }

      if (editando) {
        await api.put(`/sucursales/${editando.idSucursal}`, payload)
        setExito('Sucursal actualizada correctamente')
      } else {
        await api.post('/sucursales', payload)
        setExito('Sucursal registrada correctamente')
      }

      cargarDatos()
      setTimeout(() => setShowModal(false), 1000)
    } catch (err) {
      setError('Error al guardar la sucursal')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta sucursal?')) return
    try {
      await api.delete(`/sucursales/${id}`)
      cargarDatos()
    } catch (err) {
      alert('No se pudo eliminar la sucursal')
    }
  }

  const selector = (label, key, opciones, labelFn, valueFn) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecciona...</option>
        {opciones.map(o => (
          <option key={valueFn(o)} value={valueFn(o)}>{labelFn(o)}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏪 Sucursales</h2>
        <button
          onClick={abrirCrear}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
        >
          + Nueva Sucursal
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Gestor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dirección</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sucursales.map((s) => (
                <tr key={s.idSucursal} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{s.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {s.gestor?.usuario?.nombre} {s.gestor?.usuario?.paterno}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {s.direccion
                      ? `${s.direccion.calle?.nombre} #${s.direccion.numero}`
                      : <span className="text-gray-400 italic">Sin dirección</span>
                    }
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => abrirEditar(s)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg"
                    >
                      Editar
                    </button>
                    <BotonEliminar 
                    id={s.idSucursal} 
                    // Aquí EJECUTAMOS la función. El botón recibe un true o false (booleano).
                    tieneHijos={tieneHijos(s.idSucursal)} 
                    // Aquí EJECUTAMOS la función. El botón recibe el array de datos.
                    detalleHijos={detalleHijos(s.idSucursal)} 
                    verificando={verificando[s.idSucursal]} 
                    onEliminar={eliminar}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sucursales.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay sucursales registradas</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editando ? 'Editar Sucursal' : 'Nueva Sucursal'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3">Datos de Sucursal</h4>
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
                  {selector('Gestor', 'gestorId', gestores,
                    g => `${g.usuario?.nombre} ${g.usuario?.paterno}`,
                    g => g.idGestor
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3">Dirección</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selector('País', 'paisId', paises, p => p.nombre, p => p.idPais)}
                  {selector('Estado', 'estadoId', estados, e => e.nombre, e => e.idEstado)}
                  {selector('Ciudad', 'ciudadId', ciudades, c => c.nombre, c => c.idCiudad)}
                  {selector('Colonia', 'coloniaId', colonias, c => c.nombre, c => c.idColonia)}
                  {selector('Calle', 'calleId', calles, c => c.nombre, c => c.idCalle)}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input
                      type="text"
                      value={form.numero}
                      onChange={e => setForm({ ...form, numero: e.target.value })}
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