import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { bounceIn, slideDown, slideUp, itemFadeUp, containerStagger } from '../animations'
import logo from '../assets/Logo.png'

export default function Login() {
const [correo, setCorreo] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

const { login } = useAuth()
const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.get(`/usuarios/correo/${correo}`)
      const usuario = response.data

      if (usuario.password !== password) {
        setError('Contraseña incorrecta')
        setLoading(false)
        return
      }
      if (usuario.activo !== 'true' && usuario.activo !== '1' && usuario.activo !== 'ACTIVO') {
        setError('Usuario inactivo')
        setLoading(false)
        return
      }

      const rolNombre = usuario.rol?.nombre?.toLowerCase()
      login({
        id: usuario.idUsuario,
        nombre: `${usuario.nombre} ${usuario.paterno}`,
        correo: usuario.correo,
        rol: rolNombre,
      })
      navigate(`/${rolNombre}`)
    } catch (err) {
      setError('Usuario no encontrado')
    } finally {
      setLoading(false)
    }
  }
//xd
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Círculos decorativos animados */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-blue-500 opacity-20 rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400 opacity-10 rounded-full"
        animate={{ scale: [1, 1.15, 1], rotate: [0, -60, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10"
        variants={bounceIn}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          variants={slideDown}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
          >
            <img src={logo} alt="Logo" className="w-20 h-20 mx-auto rounded-full shadow-lg" />
          </motion.div>
          <h1 className="text-3xl font-bold text-blue-900">Huellitas</h1>
          <p className="text-gray-500 mt-1">Sistema Veterinario</p>
        </motion.div>

        {/* Campos */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={containerStagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemFadeUp}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <motion.input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
            />
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemFadeUp}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  Iniciando sesión...
                </motion.span>
              ) : 'Iniciar Sesión'}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  )
}
