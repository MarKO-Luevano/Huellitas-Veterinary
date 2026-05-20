import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import { slideDown, containerStagger, itemFadeUp } from '../../animations'

export default function VeterinarioDashboard() {
  const [stats, setStats] = useState({ pendientes: 0, enProceso: 0, completadas: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pendientes, enProceso, completadas] = await Promise.all([
          api.get('/citas/estado/pendiente'),
          api.get('/citas/estado/en proceso'),
          api.get('/citas/estado/completada'),
        ])
        setStats({
          pendientes: pendientes.data.length,
          enProceso: enProceso.data.length,
          completadas: completadas.data.length,
        })
      } catch (err) { console.error(err) }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Pendientes', value: stats.pendientes, icon: '⏳', color: 'bg-yellow-500' },
    { label: 'En Proceso', value: stats.enProceso, icon: '🔄', color: 'bg-blue-500' },
    { label: 'Completadas', value: stats.completadas, icon: '✅', color: 'bg-green-500' },
  ]

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold text-gray-800 mb-6"
        variants={slideDown}
        initial="hidden"
        animate="visible"
      >
        Panel Veterinario
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerStagger}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-white rounded-xl shadow p-6 flex items-center gap-4"
            variants={itemFadeUp}
            whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`${card.color} text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.1 }}
            >
              {card.icon}
            </motion.div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <motion.p
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                {card.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}