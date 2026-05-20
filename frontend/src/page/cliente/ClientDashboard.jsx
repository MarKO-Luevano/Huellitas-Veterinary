import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { slideDown, slideUp, containerStagger, itemFadeUp, bounceIn } from '../../animations'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [mascotas, setMascotas] = useState([])
  const [citas, setCitas] = useState([])

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      api.get(`/mascotas/usuario/${user.id}`),
      api.get(`/citas/usuario/${user.id}`),
    ]).then(([m, c]) => {
      setMascotas(m.data)
      setCitas(c.data)
    }).catch(err => console.error(err))
  }, [user])

  return (
    <div>
      <motion.div variants={slideDown} initial="hidden" animate="visible">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Bienvenid@, {user?.nombre} 👋
        </h2>
        <p className="text-gray-500 mb-6">Aquí puedes ver tu información</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerStagger}
        initial="hidden"
        animate="visible"
      >
        {/* Mascotas */}
        <motion.div
          className="bg-white rounded-xl shadow p-6"
          variants={itemFadeUp}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🐾 Mis Mascotas</h3>
          {mascotas.length === 0 ? (
            <p className="text-gray-400">No tienes mascotas registradas</p>
          ) : (
            <motion.ul className="space-y-2" variants={containerStagger} initial="hidden" animate="visible">
              {mascotas.map((m, i) => (
                <motion.li
                  key={m.idMascota}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  variants={itemFadeUp}
                  whileHover={{ x: 4, backgroundColor: '#eff6ff' }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 5 }}
                  >
                    🐶
                  </motion.span>
                  <div>
                    <p className="font-medium text-gray-800">{m.nombre}</p>
                    <p className="text-sm text-gray-500">{m.raza?.nombre} · {m.peso} kg</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>

        {/* Citas */}
        <motion.div
          className="bg-white rounded-xl shadow p-6"
          variants={itemFadeUp}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Mis Citas</h3>
          {citas.length === 0 ? (
            <p className="text-gray-400">No tienes citas registradas</p>
          ) : (
            <motion.ul className="space-y-2" variants={containerStagger} initial="hidden" animate="visible">
              {citas.map((c) => (
                <motion.li
                  key={c.idCita}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  variants={itemFadeUp}
                  whileHover={{ x: 4, backgroundColor: '#eff6ff' }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-medium text-gray-800">{c.fecha}</p>
                    <p className="text-sm text-gray-500">{c.mascota?.nombre} · {c.estadoCita}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}