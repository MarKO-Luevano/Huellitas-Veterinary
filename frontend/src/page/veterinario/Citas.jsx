import { useEffect, useState } from 'react'
import api from '../../api/axios'

const estadoColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  'en proceso': 'bg-blue-100 text-blue-700',
  completada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
}

const consultaInicial = { motivo: '', diagnostico: '', recomendaciones: '' }
const tratamientoInicial = { medicamento: '', descripcion: '', costo: '' }
const STORAGE_KEY = 'citas_ocultas'
const LIMITE_LIMPIEZA = 10

export default function Citas() {
  const [citas, setCitas] = useState([])
  const [citasOcultas, setCitasOcultas] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
    catch { return [] }
  })
  const [loading, setLoading] = useState(true)
  const [servicios, setServicios] = useState([])
  const [mostrarOcultas, setMostrarOcultas] = useState(false)

  const [citaSeleccionada, setCitaSeleccionada] = useState(null)
  const [tipoCita, setTipoCita] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [servicioId, setServicioId] = useState('')
  const [consulta, setConsulta] = useState(consultaInicial)
  const [tratamientos, setTratamientos] = useState([])
  const [tratamientoActual, setTratamientoActual] = useState(tratamientoInicial)
  const [agregarTratamiento, setAgregarTratamiento] = useState(false)

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const [citaHistorial, setCitaHistorial] = useState(null)
  const [historial, setHistorial] = useState(null)
  const [showHistorial, setShowHistorial] = useState(false)

  useEffect(() => {
    cargarCitas()
    api.get('/servicios').then(res => setServicios(res.data))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citasOcultas))
  }, [citasOcultas])

  const cargarCitas = () => {
    setLoading(true)
    api.get('/citas')
      .then(res => setCitas(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const citasVisibles = mostrarOcultas
    ? citas
    : citas.filter(c => !citasOcultas.includes(c.idCita))

  const citasArchivables = citas.filter(
    c => ['completada', 'cancelada'].includes(c.estadoCita?.toLowerCase()) &&
    !citasOcultas.includes(c.idCita)
  )

  const limpiarVista = () => {
    const idsAOcultar = citasArchivables.map(c => c.idCita)
    setCitasOcultas(prev => [...new Set([...prev, ...idsAOcultar])])
  }

  const restaurarVista = () => setCitasOcultas([])

  const abrirAtender = (cita) => {
    setCitaSeleccionada(cita)
    setTipoCita(''); setServicioId('')
    setConsulta(consultaInicial); setTratamientos([])
    setTratamientoActual(tratamientoInicial); setAgregarTratamiento(false)
    setError(''); setExito('')
    setShowModal(true)
  }

  const agregarTratamientoALista = () => {
    if (!tratamientoActual.medicamento || !tratamientoActual.costo) {
      setError('Medicamento y costo son obligatorios'); return
    }
    setTratamientos([...tratamientos, { ...tratamientoActual }])
    setTratamientoActual(tratamientoInicial)
    setAgregarTratamiento(false); setError('')
  }

  const quitarTratamiento = (index) =>
    setTratamientos(tratamientos.filter((_, i) => i !== index))

  const handleGuardar = async () => {
    if (!tipoCita) { setError('Selecciona el tipo de atención'); return }
    if (tipoCita === 'servicio' && !servicioId) { setError('Selecciona un servicio'); return }
    if (tipoCita === 'consulta' && !consulta.motivo) { setError('El motivo de consulta es obligatorio'); return }

    setGuardando(true); setError(''); setExito('')
    try {
      const citaPayload = {
        fecha: citaSeleccionada.fecha,
        estadoCita: 'completada',
        mascota: { idMascota: citaSeleccionada.mascota?.idMascota },
        sucursal: { idSucursal: citaSeleccionada.sucursal?.idSucursal },
        usuario: { idUsuario: citaSeleccionada.usuario?.idUsuario },
      }

      if (tipoCita === 'servicio') {
        await api.post('/cita-servicios', {
          cita: { idCita: citaSeleccionada.idCita },
          servicio: { idServicio: parseInt(servicioId) },
        })
        await api.put(`/citas/${citaSeleccionada.idCita}`, citaPayload)

      } else if (tipoCita === 'consulta') {
        const resConsulta = await api.post('/consultas', {
          motivo: consulta.motivo,
          diagnostico: consulta.diagnostico,
          recomendaciones: consulta.recomendaciones,
          cita: { idCita: citaSeleccionada.idCita },
        })
        const idVisita = resConsulta.data.idVisita

        for (const t of tratamientos) {
          const resTratamiento = await api.post('/tratamientos', {
            medicamento: t.medicamento,
            descripcion: t.descripcion,
            costo: parseFloat(t.costo),
          })
          await api.post('/consulta_tratamientos', {
            consultaMedica: { idVisita },
            tratamiento: { idTratamiento: resTratamiento.data.idTratamiento },
          })
        }
        await api.put(`/citas/${citaSeleccionada.idCita}`, citaPayload)
      }

      setExito('Cita atendida correctamente')
      cargarCitas()
      setTimeout(() => setShowModal(false), 1200)
    } catch (err) {
      console.error(err)
      setError(`Error al guardar: ${err.response?.data?.message || err.message}`)
    } finally {
      setGuardando(false)
    }
  }

  const verHistorial = async (cita) => {
    setCitaHistorial(cita); setHistorial(null); setShowHistorial(true)
    try {
      const serviciosCita = await api.get(`/cita-servicios/cita/${cita.idCita}`)
      let consultaCita = null
      let tratamientosCita = []
      try {
      const resConsulta = await api.get(`/consultas/cita/${cita.idCita}`)
      consultaCita = resConsulta.data[0] || null
        if (consultaCita?.idVisita) {
          const resTratamientos = await api.get(`/consulta_tratamientos/consulta/${consultaCita.idVisita}`)
          tratamientosCita = resTratamientos.data
        }
      } catch { consultaCita = null }
      setHistorial({ servicios: serviciosCita.data || [], consulta: consultaCita, tratamientos: tratamientosCita })
    } catch (err) {
      console.error(err)
      setHistorial({ servicios: [], consulta: null, tratamientos: [] })
    }
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    const cita = citas.find(c => c.idCita === id)
    try {
      await api.put(`/citas/${id}`, {
        fecha: cita.fecha, estadoCita: nuevoEstado,
        mascota: { idMascota: cita.mascota?.idMascota },
        sucursal: { idSucursal: cita.sucursal?.idSucursal },
        usuario: { idUsuario: cita.usuario?.idUsuario },
      })
      cargarCitas()
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📅 Citas</h2>
          {citasOcultas.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {citasOcultas.length} cita{citasOcultas.length > 1 ? 's' : ''} archivada{citasOcultas.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {/* Botón archivar — siempre visible si hay archivables */}
          {citasArchivables.length > 0 && !mostrarOcultas && (
            <button
              onClick={limpiarVista}
              className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors ${
                citasArchivables.length >= LIMITE_LIMPIEZA
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              🗂️ Archivar completadas
              {citasArchivables.length >= LIMITE_LIMPIEZA && (
                <span className="ml-1 bg-white text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {citasArchivables.length}
                </span>
              )}
            </button>
          )}

          {citasOcultas.length > 0 && (
            <>
              <button
                onClick={() => setMostrarOcultas(!mostrarOcultas)}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold rounded-lg transition-colors"
              >
                {mostrarOcultas ? '🙈 Ocultar archivadas' : '📂 Ver archivadas'}
              </button>
              <button
                onClick={restaurarVista}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-semibold rounded-lg transition-colors"
              >
                ↩️ Restaurar todo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Aviso cuando se acumulan 10+ */}
      {citasArchivables.length >= LIMITE_LIMPIEZA && !mostrarOcultas && (
        <div className="mb-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
          <p className="text-sm text-orange-700">
            📋 Tienes <strong>{citasArchivables.length} citas</strong> completadas/canceladas acumuladas. Se recomienda archivarlas para mantener la vista limpia.
          </p>
          <button
            onClick={limpiarVista}
            className="ml-4 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg"
          >
            Archivar ahora
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Mascota</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Dueño</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Sucursal</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {citasVisibles.map((c) => (
                <tr key={c.idCita} className={`hover:bg-gray-50 ${citasOcultas.includes(c.idCita) ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.fecha}</td>
                  <td className="px-4 py-4 font-medium text-gray-800">{c.mascota?.nombre}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.usuario?.nombre} {c.usuario?.paterno}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.sucursal?.nombre}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[c.estadoCita?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                      {c.estadoCita}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {c.estadoCita?.toLowerCase() === 'pendiente' && (
                        <>
                          <button onClick={() => abrirAtender(c)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">Atender</button>
                          <button onClick={() => cambiarEstado(c.idCita, 'cancelada')} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg">Cancelar</button>
                        </>
                      )}
                      {c.estadoCita?.toLowerCase() === 'completada' && (
                        <button onClick={() => verHistorial(c)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg">Ver historial</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {citasVisibles.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-2">No hay citas activas en este momento</p>
              {citasOcultas.length > 0 && (
                <button onClick={() => setMostrarOcultas(true)} className="text-blue-500 text-sm hover:underline">
                  Ver {citasOcultas.length} citas archivadas
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Atender Cita */}
      {showModal && citaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-4">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Atender Cita</h3>
            <p className="text-sm text-gray-500 mb-4">
              🐾 <strong>{citaSeleccionada.mascota?.nombre}</strong> —
              Dueño: {citaSeleccionada.usuario?.nombre} {citaSeleccionada.usuario?.paterno} —
              Sucursal: {citaSeleccionada.sucursal?.nombre}
            </p>

            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-700 uppercase mb-2">Tipo de atención</p>
              <div className="flex gap-3">
                <button onClick={() => { setTipoCita('servicio'); setError('') }}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${tipoCita === 'servicio' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  🛁 Servicio
                </button>
                <button onClick={() => { setTipoCita('consulta'); setError('') }}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${tipoCita === 'consulta' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  🩺 Consulta Médica
                </button>
              </div>
            </div>

            {tipoCita === 'servicio' && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-blue-700 uppercase">Selecciona el servicio</p>
                <select value={servicioId} onChange={e => setServicioId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(s => <option key={s.idServicio} value={s.idServicio}>{s.nombre} — ${s.costo}</option>)}
                </select>
              </div>
            )}

            {tipoCita === 'consulta' && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-blue-700 uppercase">Datos de la Consulta</p>
                {[['Motivo *', 'motivo'], ['Diagnóstico', 'diagnostico'], ['Recomendaciones', 'recomendaciones']].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <textarea value={consulta[key]} onChange={e => setConsulta({ ...consulta, [key]: e.target.value })}
                      rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-blue-700 uppercase">Tratamientos</p>
                    {!agregarTratamiento && (
                      <button onClick={() => setAgregarTratamiento(true)} className="text-sm text-blue-600 hover:underline">+ Agregar tratamiento</button>
                    )}
                  </div>

                  {tratamientos.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {tratamientos.map((t, i) => (
                        <div key={i} className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{t.medicamento}</p>
                            <p className="text-xs text-gray-500">{t.descripcion} — ${t.costo}</p>
                          </div>
                          <button onClick={() => quitarTratamiento(i)} className="text-red-500 hover:text-red-700 text-sm font-bold">✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {agregarTratamiento && (
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Nuevo tratamiento</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Medicamento *</label>
                          <input type="text" value={tratamientoActual.medicamento}
                            onChange={e => setTratamientoActual({ ...tratamientoActual, medicamento: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Costo *</label>
                          <input type="number" step="0.01" value={tratamientoActual.costo}
                            onChange={e => setTratamientoActual({ ...tratamientoActual, costo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-1">Descripción / Dosis</label>
                          <input type="text" value={tratamientoActual.descripcion}
                            onChange={e => setTratamientoActual({ ...tratamientoActual, descripcion: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={agregarTratamientoALista} className="px-4 py-1.5 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800">Agregar</button>
                        <button onClick={() => { setAgregarTratamiento(false); setTratamientoActual(tratamientoInicial) }}
                          className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-3">⚠️ {error}</p>}
            {exito && <p className="text-green-600 text-sm mt-3">✅ {exito}</p>}

            <div className="flex gap-3 mt-5">
              <button onClick={handleGuardar} disabled={guardando}
                className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors">
                {guardando ? 'Guardando...' : 'Guardar Atención'}
              </button>
              <button onClick={() => setShowModal(false)} disabled={guardando}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial Clínico */}
      {showHistorial && citaHistorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-4">
            <h3 className="text-xl font-bold text-gray-800 mb-1">📋 Historial Clínico</h3>
            <p className="text-gray-500 text-sm mb-4">
              🐾 <strong>{citaHistorial.mascota?.nombre}</strong> — {citaHistorial.fecha}
            </p>

            {!historial ? (
              <p className="text-gray-400 text-sm">Cargando historial...</p>
            ) : (
              <div className="space-y-4">
                {historial.servicios?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-blue-700 uppercase mb-2">🛁 Servicio realizado</p>
                    {historial.servicios.map((s, i) => (
                      <div key={i} className="bg-blue-50 px-4 py-2 rounded-lg">
                        <p className="font-medium text-gray-800">{s.servicio?.nombre}</p>
                        <p className="text-sm text-gray-500">Costo: ${s.servicio?.costo}</p>
                      </div>
                    ))}
                  </div>
                )}
                {historial.consulta && (
                  <div>
                    <p className="text-sm font-semibold text-blue-700 uppercase mb-2">🩺 Consulta Médica</p>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg space-y-1">
                      <p className="text-sm"><span className="font-medium">Motivo:</span> {historial.consulta.motivo}</p>
                      <p className="text-sm"><span className="font-medium">Diagnóstico:</span> {historial.consulta.diagnostico}</p>
                      <p className="text-sm"><span className="font-medium">Recomendaciones:</span> {historial.consulta.recomendaciones}</p>
                    </div>
                  </div>
                )}
                {historial.tratamientos?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-blue-700 uppercase mb-2">💊 Tratamientos</p>
                    <div className="space-y-2">
                      {historial.tratamientos.map((t, i) => (
                        <div key={i} className="bg-green-50 px-4 py-2 rounded-lg">
                          <p className="font-medium text-gray-800">{t.tratamiento?.medicamento}</p>
                          <p className="text-sm text-gray-500">{t.tratamiento?.descripcion}</p>
                          <p className="text-sm text-gray-500">Costo: ${t.tratamiento?.costo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {historial.servicios?.length === 0 && !historial.consulta && (
                  <p className="text-gray-400 text-sm">No hay registros para esta cita</p>
                )}
              </div>
            )}

            <button onClick={() => setShowHistorial(false)}
              className="w-full mt-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}