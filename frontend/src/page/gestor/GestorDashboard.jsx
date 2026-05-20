import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import api from '../../api/axios'

const fechaAString = (fechaISO) => {
  if (!fechaISO) return ''
  const fecha = new Date(fechaISO)
  const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000)
  return fechaLocal.toISOString().split('T')[0]
}

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A'
  const fecha = new Date(fechaISO)
  const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000)
  return fechaLocal.toLocaleDateString('es-MX')
}

export default function GestorDashboard() {
  const { user } = useAuth()

  const [citasHoy, setCitasHoy] = useState([])
  const [citaSeleccionada, setCitaSeleccionada] = useState(null)
  const [tratamientos, setTratamientos] = useState([])
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState('')
  const [listaMedicamentos, setListaMedicamentos] = useState([])
  const [consulta, setConsulta] = useState({ motivo: '', diagnostico: '', recomendaciones: '' })
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [hoveredCita, setHoveredCita] = useState(null)
  const [mostrarConsultas, setMostrarConsultas] = useState(false)
  const [consultasRealizadas, setConsultasRealizadas] = useState([])
  const [loadingConsultas, setLoadingConsultas] = useState(false)
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null)
  const [medicamentosConsultaSeleccionada, setMedicamentosConsultaSeleccionada] = useState([])

  const hoy = new Date().toLocaleDateString('sv-SE')
  const fechaDisplay = new Date().toLocaleDateString('es-MX')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [citasRes, tratamientosRes] = await Promise.all([
        api.get('/citas'),
        api.get('/tratamientos'),
      ])
      const citasDeHoy = citasRes.data.filter(c => {
        const fechaCita = fechaAString(c.fecha)
        const estadoOk = c.estadoCita?.toLowerCase() === 'pendiente'
        return fechaCita === hoy && estadoOk
      })
      setCitasHoy(citasDeHoy)
      setTratamientos(tratamientosRes.data)
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSeleccionarCita = (cita) => {
    setCitaSeleccionada(cita)
    setConsulta({ motivo: '', diagnostico: '', recomendaciones: '' })
    setListaMedicamentos([])
    setTratamientoSeleccionado('')
    setMensaje(null)
  }

  const handleAgregarMedicamento = () => {
    if (!tratamientoSeleccionado) return
    const trat = tratamientos.find(t => t.idTratamiento === parseInt(tratamientoSeleccionado))
    if (!trat) return
    if (listaMedicamentos.find(m => m.idTratamiento === trat.idTratamiento)) return
    setListaMedicamentos(prev => [...prev, trat])
    setTratamientoSeleccionado('')
  }

  const handleQuitarUltimo = () => {
    setListaMedicamentos(prev => prev.slice(0, -1))
  }

  const handleGuardar = async () => {
    if (!citaSeleccionada) {
      setMensaje({ tipo: 'error', texto: 'Selecciona una cita primero.' })
      return
    }
    if (!consulta.motivo && !consulta.diagnostico && !consulta.recomendaciones) {
      setMensaje({ tipo: 'error', texto: 'Completa al menos un campo de la consulta.' })
      return
    }
    setGuardando(true)
    setMensaje(null)
    try {
      const consultaPayload = {
        cita: { idCita: citaSeleccionada.idCita },
        motivo: consulta.motivo,
        diagnostico: consulta.diagnostico,
        recomendaciones: consulta.recomendaciones,
      }
      const consultaRes = await api.post('/consultas', consultaPayload)
      const idVisita = consultaRes.data.idVisita

      await Promise.all(
        listaMedicamentos.map(m =>
          api.post('/consulta_tratamientos', {
            consultaMedica: { idVisita },
            tratamiento: { idTratamiento: m.idTratamiento },
          })
        )
      )

      await api.put(`/citas/${citaSeleccionada.idCita}`, {
        ...citaSeleccionada,
        estadoCita: 'completada',
        mascota: { idMascota: citaSeleccionada.mascota?.idMascota },
        usuario: { idUsuario: citaSeleccionada.usuario?.idUsuario },
        sucursal: { idSucursal: citaSeleccionada.sucursal?.idSucursal },
      })

      setMensaje({ tipo: 'ok', texto: 'Consulta guardada exitosamente.' })
      setCitaSeleccionada(null)
      setConsulta({ motivo: '', diagnostico: '', recomendaciones: '' })
      setListaMedicamentos([])
      setTratamientoSeleccionado('')
      cargarDatos()
    } catch (err) {
      console.error('Error guardando consulta:', err)
      setMensaje({ tipo: 'error', texto: 'Error al guardar. Revisa la consola.' })
    } finally {
      setGuardando(false)
    }
  }

  const handleVerConsultas = async () => {
    if (mostrarConsultas) {
      setMostrarConsultas(false)
      setConsultaSeleccionada(null)
      setMedicamentosConsultaSeleccionada([])
      return
    }
    setLoadingConsultas(true)
    try {
      const res = await api.get('/consultas')
      setConsultasRealizadas(res.data)
      setMostrarConsultas(true)
    } catch (err) {
      console.error('Error cargando consultas:', err)
    } finally {
      setLoadingConsultas(false)
    }
  }

  const handleSeleccionarConsultaHistorial = async (c) => {
    if (consultaSeleccionada?.idVisita === c.idVisita) {
      setConsultaSeleccionada(null)
      setMedicamentosConsultaSeleccionada([])
      return
    }
    setConsultaSeleccionada(c)
    try {
      const res = await api.get(`/consulta_tratamientos/consulta/${c.idVisita}`)
      const meds = res.data.map(ct => ct.tratamiento).filter(Boolean)
      setMedicamentosConsultaSeleccionada(meds)
    } catch (err) {
      console.error('Error cargando tratamientos:', err)
      setMedicamentosConsultaSeleccionada([])
    }
  }

  const getFuenteDatos = () => {
    if (consultaSeleccionada) {
      return {
        mascota: consultaSeleccionada.cita?.mascota?.nombre ?? 'N/A',
        fecha: formatearFecha(consultaSeleccionada.cita?.fecha),
        dueno: consultaSeleccionada.cita?.usuario
          ? `${consultaSeleccionada.cita.usuario.nombre} ${consultaSeleccionada.cita.usuario.paterno}`
          : 'N/A',
        motivo: consultaSeleccionada.motivo || '—',
        diagnostico: consultaSeleccionada.diagnostico || '—',
        recomendaciones: consultaSeleccionada.recomendaciones || '—',
        medicamentos: medicamentosConsultaSeleccionada,
      }
    }
    if (citaSeleccionada) {
      return {
        mascota: citaSeleccionada.mascota?.nombre ?? 'N/A',
        fecha: formatearFecha(citaSeleccionada.fecha),
        dueno: citaSeleccionada.usuario
          ? `${citaSeleccionada.usuario.nombre} ${citaSeleccionada.usuario.paterno}`
          : 'N/A',
        motivo: consulta.motivo || '—',
        diagnostico: consulta.diagnostico || '—',
        recomendaciones: consulta.recomendaciones || '—',
        medicamentos: listaMedicamentos,
      }
    }
    return null
  }

  const handleExportarPDF = () => {
    const d = getFuenteDatos()
    if (!d) {
      alert('Selecciona una consulta del historial o una cita activa antes de exportar.')
      return
    }

    const doc = new jsPDF()
    const margen = 20
    let y = 20

    const linea = () => {
      doc.setDrawColor(180)
      doc.line(margen, y, 190, y)
      y += 6
    }

    const campo = (label, valor) => {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(label, margen, y)
      doc.setFont('helvetica', 'normal')
      doc.text(String(valor ?? '—'), margen + 45, y)
      y += 7
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`RECETA PARA: "${d.mascota}_${d.fecha}"`, margen, y)
    y += 4
    linea()

    campo('MOTIVO:', d.motivo)
    campo('DIAGNOSTICO:', d.diagnostico)
    campo('RECOMENDACIONES:', d.recomendaciones)
    y += 2
    linea()

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('LISTA DE MEDICAMENTOS', margen, y)
    y += 7

    if (d.medicamentos.length === 0) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.text('No se agrego ningun medicamento.', margen, y)
      y += 7
    } else {
      d.medicamentos.forEach((m, idx) => {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(
          `${idx + 1}. ${m.medicamento} - ${m.descripcion} ($${m.costo})`,
          margen + 4, y
        )
        y += 6
      })
    }

    y += 4
    linea()

    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(130)
    doc.text(`Dueno: ${d.dueno}  |  Generado: ${new Date().toLocaleDateString('es-MX')}`, margen, y)
    doc.setTextColor(0)

    const nombre = d.mascota.replace(/\s+/g, '_')
    doc.save(`receta_${nombre}_${new Date().toLocaleDateString('sv-SE')}.pdf`)
  }

  const handleExportarExcel = () => {
    const d = getFuenteDatos()
    if (!d) {
      alert('Selecciona una consulta del historial o una cita activa antes de exportar.')
      return
    }

    const fila = {
      Mascota: d.mascota,
      'Fecha Cita': d.fecha,
      Dueno: d.dueno,
      Motivo: d.motivo,
      Diagnostico: d.diagnostico,
      Recomendaciones: d.recomendaciones,
      Medicamentos: d.medicamentos.length > 0
        ? d.medicamentos.map(m => m.medicamento).join(', ')
        : 'Ninguno',
      'Costo Total': d.medicamentos.reduce((sum, m) => sum + (m.costo ?? 0), 0),
    }

    const hoja = XLSX.utils.json_to_sheet([fila])
    hoja['!cols'] = [
      { wch: 15 }, { wch: 12 }, { wch: 20 },
      { wch: 25 }, { wch: 25 }, { wch: 30 },
      { wch: 30 }, { wch: 12 },
    ]

    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, 'Consulta')

    const nombre = d.mascota.replace(/\s+/g, '_')
    XLSX.writeFile(libro, `consulta_${nombre}_${new Date().toLocaleDateString('sv-SE')}.xlsx`)
  }

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-xl border-2 border-gray-500">

        {/* Título */}
        <div className="border-b-2 border-gray-500 text-center py-1 bg-white">
          <p className="text-sm font-bold tracking-widest">CONSULTAS</p>
        </div>

        {/* Nombre y fecha */}
        <div className="border-b border-gray-400 px-4 py-2 flex justify-between bg-white">
          <div>
            <p className="text-xs font-bold">NOMBRE:</p>
            <p className="text-xs text-gray-600">{user?.nombre}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold">FECHA:</p>
            <p className="text-xs text-gray-600">{fechaDisplay}</p>
          </div>
        </div>

        <div className="p-4 space-y-4 bg-white">

          <p className="text-center text-sm font-bold">CITAS</p>

          {/* Lista mascotas con citas hoy */}
          <div className="border-2 border-gray-500 p-3">
            <p className="text-center text-xs font-bold">LISTAS DE MASCOTAS</p>
            <p className="text-center text-xs font-bold">CON CITAS AGENDADAS PARA EL DIA DE HOY:</p>
            <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
              {loading ? (
                <p className="text-center text-xs text-gray-400">Cargando...</p>
              ) : citasHoy.length === 0 ? (
                <p className="text-center text-xs text-gray-400">No hay citas pendientes para hoy</p>
              ) : (
                citasHoy.map(c => (
                  <div
                    key={c.idCita}
                    className="relative"
                    onMouseEnter={() => setHoveredCita(c.idCita)}
                    onMouseLeave={() => setHoveredCita(null)}
                  >
                    <motion.button
                      onClick={() => handleSeleccionarCita(c)}
                      className={`w-full text-left px-3 py-1.5 text-xs border transition-colors ${
                        citaSeleccionada?.idCita === c.idCita
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      🐾 {c.mascota?.nombre} — Dueño: {c.usuario?.nombre} {c.usuario?.paterno} — Cita #{c.idCita}
                    </motion.button>

                    <AnimatePresence>
                      {hoveredCita === c.idCita && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full z-20 bg-gray-800 text-white text-xs rounded shadow-lg px-3 py-2 min-w-max"
                        >
                          <p><span className="font-bold">Mascota:</span> {c.mascota?.nombre ?? 'N/A'}</p>
                          <p><span className="font-bold">Nacimiento:</span> {formatearFecha(c.mascota?.fechaNacimiento)}</p>
                          <p><span className="font-bold">Dueño:</span> {c.usuario ? `${c.usuario.nombre} ${c.usuario.paterno}` : 'N/A'}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info mascota seleccionada */}
          <AnimatePresence>
            {citaSeleccionada && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3">
                  <div className="border-2 border-gray-500 p-3 flex-1 text-center">
                    <p className="text-xs font-bold">NOMBRE DE LA MASCOTA:</p>
                    <p className="text-sm font-semibold mt-1 text-gray-800">
                      {citaSeleccionada.mascota?.nombre ?? 'N/A'}
                    </p>
                  </div>
                  <div className="border-2 border-gray-500 p-3 flex-1 text-center">
                    <p className="text-xs font-bold">FECHA DE NACIMIENTO:</p>
                    <p className="text-sm font-semibold mt-1 text-gray-800">
                      {formatearFecha(citaSeleccionada.mascota?.fechaNacimiento)}
                    </p>
                  </div>
                  <div className="border-2 border-gray-500 p-3 flex-1 text-center">
                    <p className="text-xs font-bold">DUEÑO:</p>
                    <p className="text-sm font-semibold mt-1 text-gray-800">
                      {citaSeleccionada.usuario
                        ? `${citaSeleccionada.usuario.nombre} ${citaSeleccionada.usuario.paterno}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Datos de la consulta */}
          <div className="border border-gray-400 px-3 py-1 text-center">
            <p className="text-xs font-bold">DATOS DE LA CONSULTA:</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'MOTIVO:', key: 'motivo' },
              { label: 'DIAGNOSTICO:', key: 'diagnostico' },
              { label: 'RECOMENDACIONES:', key: 'recomendaciones' },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center gap-2">
                <label className="text-xs font-bold w-36 text-right flex-shrink-0">{label}</label>
                <input
                  type="text"
                  value={consulta[key]}
                  onChange={e => setConsulta({ ...consulta, [key]: e.target.value })}
                  disabled={!citaSeleccionada}
                  placeholder={!citaSeleccionada ? 'Selecciona una cita primero' : ''}
                  className="flex-1 border border-gray-400 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            ))}
          </div>

          {/* Menú medicamentos */}
          <div className="border-2 border-gray-500 p-3">
            <p className="text-center text-xs font-bold">MENU DESPLEGABLE</p>
            <p className="text-center text-xs font-bold">CON LOS MEDICAMENTOS POSIBLES A RECETAR</p>
            <select
              value={tratamientoSeleccionado}
              onChange={e => setTratamientoSeleccionado(e.target.value)}
              disabled={!citaSeleccionada}
              className="w-full mt-2 border border-gray-400 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">-- Selecciona un medicamento --</option>
              {tratamientos.map(t => (
                <option key={t.idTratamiento} value={t.idTratamiento}>
                  {t.medicamento} — {t.descripcion} (${t.costo})
                </option>
              ))}
            </select>
          </div>

          {/* Botones AGREGAR / QUITAR */}
          <div className="flex justify-center gap-6">
            <motion.button
              onClick={handleAgregarMedicamento}
              disabled={!citaSeleccionada || !tratamientoSeleccionado}
              className="px-8 py-1.5 border-2 border-gray-500 bg-white hover:bg-gray-100 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AGREGAR
            </motion.button>
            <motion.button
              onClick={handleQuitarUltimo}
              disabled={listaMedicamentos.length === 0}
              className="px-8 py-1.5 border-2 border-gray-500 bg-white hover:bg-gray-100 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              QUITAR
            </motion.button>
          </div>

          {/* Lista tiempo real medicamentos */}
          <div className="border-2 border-gray-500 min-h-20 p-3">
            <p className="text-center text-xs font-bold mb-2">LISTA DE MEDICAMENTOS AGREGADOS</p>
            {listaMedicamentos.length === 0 ? (
              <p className="text-center text-xs text-gray-400">Sin medicamentos agregados</p>
            ) : (
              <ul className="space-y-1">
                <AnimatePresence>
                  {listaMedicamentos.map(m => (
                    <motion.li
                      key={m.idTratamiento}
                      className="flex justify-between items-center text-xs border border-gray-200 px-2 py-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>💊 {m.medicamento} — {m.descripcion} (${m.costo})</span>
                      <button
                        onClick={() =>
                          setListaMedicamentos(prev =>
                            prev.filter(x => x.idTratamiento !== m.idTratamiento)
                          )
                        }
                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                      >
                        ✕
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {/* Mensaje estado */}
          <AnimatePresence>
            {mensaje && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center text-xs py-2 px-3 border ${
                  mensaje.tipo === 'ok'
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : 'border-red-400 bg-red-50 text-red-700'
                }`}
              >
                {mensaje.texto}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón guardar */}
          <div className="flex justify-center pt-1">
            <motion.button
              onClick={handleGuardar}
              disabled={!citaSeleccionada || guardando}
              className="px-12 py-2 border-2 border-gray-700 bg-gray-800 text-white hover:bg-gray-700 text-xs font-bold tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {guardando ? 'GUARDANDO...' : 'GUARDAR CONSULTA'}
            </motion.button>
          </div>

          {/* Botón Ver Consultas Realizadas */}
          <div className="flex justify-center pt-1">
            <motion.button
              onClick={handleVerConsultas}
              disabled={loadingConsultas}
              className="px-8 py-2 border-2 border-gray-500 bg-white hover:bg-gray-100 text-xs font-bold tracking-widest disabled:opacity-40"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loadingConsultas ? 'CARGANDO...' : mostrarConsultas ? 'OCULTAR CONSULTAS' : 'VER CONSULTAS REALIZADAS'}
            </motion.button>
          </div>

          {/* Panel consultas realizadas */}
          <AnimatePresence>
            {mostrarConsultas && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-2 border-gray-500 p-3">
                  <p className="text-center text-xs font-bold mb-3">
                    AQUI SE MUESTRAN TODOS LOS DATOS DE LAS CONSULTAS REALIZADAS
                  </p>

                  {consultasRealizadas.length === 0 ? (
                    <p className="text-center text-xs text-gray-400">No hay consultas registradas</p>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {consultasRealizadas.map(c => (
                          <motion.div
                            key={c.idVisita}
                            onClick={() => handleSeleccionarConsultaHistorial(c)}
                            className={`border px-3 py-2 text-xs cursor-pointer transition-colors ${
                              consultaSeleccionada?.idVisita === c.idVisita
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'border-gray-300 hover:bg-gray-100'
                            }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Cabecera */}
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold">
                                🐾 {c.cita?.mascota?.nombre ?? `Cita #${c.cita?.idCita}`}
                                {consultaSeleccionada?.idVisita === c.idVisita && (
                                  <span className="ml-2 font-normal italic text-gray-300">✔ seleccionada</span>
                                )}
                              </span>
                              <span className={`text-xs ${consultaSeleccionada?.idVisita === c.idVisita ? 'text-gray-300' : 'text-gray-500'}`}>
                                Visita #{c.idVisita} — Cita #{c.cita?.idCita}
                              </span>
                            </div>

                            {/* Datos consulta */}
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <p className="font-bold">MOTIVO:</p>
                                <p>{c.motivo || '—'}</p>
                              </div>
                              <div>
                                <p className="font-bold">DIAGNOSTICO:</p>
                                <p>{c.diagnostico || '—'}</p>
                              </div>
                              <div>
                                <p className="font-bold">RECOMENDACIONES:</p>
                                <p>{c.recomendaciones || '—'}</p>
                              </div>
                            </div>

                            {/* Fecha */}
                            {c.cita?.fecha && (
                              <p className={`mt-1 text-xs ${consultaSeleccionada?.idVisita === c.idVisita ? 'text-gray-300' : 'text-gray-400'}`}>
                                Fecha de cita: {formatearFecha(c.cita.fecha)}
                              </p>
                            )}

                            {/* Medicamentos — solo visible cuando está seleccionada */}
                            {consultaSeleccionada?.idVisita === c.idVisita && (
                              <div className="mt-2 pt-2 border-t border-gray-600">
                                <p className="font-bold mb-1">MEDICAMENTOS:</p>
                                {medicamentosConsultaSeleccionada.length === 0 ? (
                                  <p className="italic text-gray-300">Sin medicamentos registrados</p>
                                ) : (
                                  <ul className="space-y-0.5">
                                    {medicamentosConsultaSeleccionada.map(m => (
                                      <li key={m.idTratamiento}>
                                        💊 {m.medicamento} — {m.descripcion} (${m.costo})
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Indicador selección */}
                      <p className="text-center text-xs text-gray-400 mt-2 italic">
                        {consultaSeleccionada
                          ? `✔ Seleccionada: ${consultaSeleccionada.cita?.mascota?.nombre} — Visita #${consultaSeleccionada.idVisita}`
                          : 'Haz clic en una consulta para seleccionarla antes de exportar'}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones Exportar */}
          <div className="flex justify-center gap-6 pt-2 pb-2">
            <motion.button
              onClick={handleExportarPDF}
              className="px-8 py-2 border-2 border-gray-500 bg-white hover:bg-gray-100 text-xs font-bold tracking-widest"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              EXPORTAR PDF
            </motion.button>
            <motion.button
              onClick={handleExportarExcel}
              className="px-8 py-2 border-2 border-gray-500 bg-white hover:bg-gray-100 text-xs font-bold tracking-widest"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              EXPORTAR EXCEL
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  )
}