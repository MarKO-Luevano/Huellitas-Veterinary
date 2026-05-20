import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import { slideDown, containerStagger, itemFadeUp } from '../../animations'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ sucursales: 0, gestores: 0, usuarios: 0, mascotas: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sucursales, gestores, usuarios, mascotas] = await Promise.all([
          api.get('/sucursales'),
          api.get('/gestores'),
          api.get('/usuarios'),
          api.get('/mascotas'),
        ])
        setStats({
          sucursales: sucursales.data.length,
          gestores: gestores.data.length,
          usuarios: usuarios.data.length,
          mascotas: mascotas.data.length,
        })
      } catch (err) { console.error(err) }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Sucursales', value: stats.sucursales, icon: '🏪', color: 'bg-blue-500' },
    { label: 'Gestores', value: stats.gestores, icon: '👤', color: 'bg-green-500' },
    { label: 'Usuarios', value: stats.usuarios, icon: '👥', color: 'bg-purple-500' },
    { label: 'Mascotas', value: stats.mascotas, icon: '🐾', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold text-gray-800 mb-6"
        variants={slideDown}
        initial="hidden"
        animate="visible"
      >
        Panel Administrador
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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