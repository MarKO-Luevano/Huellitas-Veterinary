import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Nota: Eliminamos las llamadas de función (id) porque los datos ya vienen filtrados del padre
export default function BotonEliminar({ id, tieneHijos, detalleHijos, verificando, onEliminar }) {
    const [showDetalle, setShowDetalle] = useState(false)
    
    // CORRECCIÓN: Usamos las props como valores, no como funciones
    const deshabilitado = tieneHijos || verificando
    const grupos = detalleHijos || []

    return (
    <>
        <motion.button
        onClick={() => {
            if (verificando) return
            if (tieneHijos) {
                // Si tiene hijos abrirá modal con detalle
                setShowDetalle(true)
            } else {
                onEliminar(id)
            }
        }}
        className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
            deshabilitado
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
        }`}
        whileHover={{ scale: verificando ? 1 : 1.05 }}
        whileTap={{ scale: verificando ? 1 : 0.95 }}
        title={tieneHijos ? 'Ver por qué no se puede eliminar' : 'Eliminar registro'}
        >
        {verificando ? (
            <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            >
            ···
            </motion.span>
        ) : tieneHijos ? '🔒 Eliminar' : '🗑️ Eliminar'}
        </motion.button>

      {/* Modal de detalle de hijos */}
        <AnimatePresence>
        {showDetalle && (
            <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowDetalle(false)}
            >
            <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
                exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
            >
              {/* Ícono y título */}
                <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">
                    🚫
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">No se puede eliminar</h3>
                    <p className="text-sm text-gray-500">Este registro tiene dependencias activas</p>
                </div>
                </div>

              {/* Explicación */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-4">
                <p className="text-sm text-orange-800">
                    ⚠️ No puedes eliminar este registro porque tiene relación con otros registros hijos.
                    Debes eliminar primero los siguientes registros antes de poder continuar:
                </p>
                </div>

              {/* Detalle por grupo */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                {grupos.map((grupo, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                        📋 {grupo.label}
                        </span>
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {grupo.registros.length} registro{grupo.registros.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {grupo.registros.slice(0, 5).map((nombre, j) => (
                        <li key={j} className="px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                            {nombre}
                        </li>
                        ))}
                        {grupo.registros.length > 5 && (
                        <li className="px-4 py-2 text-xs text-gray-400 italic">
                        ... y {grupo.registros.length - 5} más
                        </li>
                        )}
                    </ul>
                    </div>
                ))}
                </div>

              {/* Botón cerrar */}
                <motion.button
                onClick={() => setShowDetalle(false)}
                className="w-full mt-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                >
                Entendido
                </motion.button>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    </>
    )
}