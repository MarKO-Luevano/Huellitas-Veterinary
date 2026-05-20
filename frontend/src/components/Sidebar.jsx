import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { slideLeft, containerStagger, itemFadeUp } from '../animations'

const menuItems = {
  admin: [
    { label: '🏠 Dashboard', path: '/admin' },
    { label: '🏪 Sucursales', path: '/admin/sucursales' },
    { label: '👤 Gestores', path: '/admin/gestores' },
  ],
  gestor: [
    { label: '🏠 Dashboard', path: '/gestor' },
    { label: '👥 Clientes', path: '/gestor/clientes' },
    { label: '🐾 Mascotas', path: '/gestor/mascotas' },
  ],
  veterinario: [
    { label: '🏠 Dashboard', path: '/veterinario' },
    { label: '📅 Citas', path: '/veterinario/citas' },
  ],
  cliente: [
    { label: '🏠 Dashboard', path: '/cliente' },
    { label: '🐾 Mis Mascotas', path: '/cliente/mascotas' },
    { label: '📅 Mis Citas', path: '/cliente/citas' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = menuItems[user?.rol] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.div
      className="w-64 min-h-screen bg-blue-900 text-white flex flex-col"
      variants={slideLeft}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div
        className="p-6 border-b border-blue-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.h1
          className="text-xl font-bold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
        >
          🐾 Huellitas
        </motion.h1>
        <p className="text-blue-300 text-sm mt-1 capitalize">{user?.rol}</p>
        <p className="text-blue-400 text-xs">{user?.nombre}</p>
      </motion.div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <motion.ul
          className="space-y-2"
          variants={containerStagger}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <motion.li key={item.path} variants={itemFadeUp}>
                <Link to={item.path}>
                  <motion.div
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'hover:bg-blue-700'
                    }`}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* Logout */}
      <motion.div
        className="p-4 border-t border-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          🚪 Cerrar Sesión
        </motion.button>
      </motion.div>
    </motion.div>
  )
}