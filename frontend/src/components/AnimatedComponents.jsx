import { motion, AnimatePresence } from 'framer-motion'
import {
    slideDown, slideUp, containerStagger,
    itemFadeUp, backdropAnim, modalAnim
} from '../animations'

// Wrapper de página — envuelve el contenido principal de cada vista
export function PageWrapper({ children }) {
    return (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
    )
}

// Tabla animada con filas en stagger
export function AnimatedTable({ headers, rows, emptyMessage = 'No hay registros' }) {
    return (
    <motion.div
        className="bg-white rounded-xl shadow overflow-hidden"
        variants={slideUp}
        initial="hidden"
        animate="visible"
    >
        <table className="w-full">
        <thead className="bg-blue-900 text-white">
            <tr>
            {headers.map((h) => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold">{h}</th>
            ))}
            </tr>
        </thead>
        <motion.tbody
            className="divide-y divide-gray-100"
            variants={containerStagger}
            initial="hidden"
            animate="visible"
        >
            {rows.length === 0 ? (
            <tr>
                <td colSpan={headers.length} className="text-center text-gray-400 py-8">
                {emptyMessage}
                </td>
            </tr>
            ) : (
            rows.map((row, i) => (
                <motion.tr
                key={i}
                className="hover:bg-gray-50"
                variants={itemFadeUp}
                whileHover={{ backgroundColor: '#f0f7ff' }}
                transition={{ duration: 0.15 }}
                >
                {row}
                </motion.tr>
            ))
            )}
        </motion.tbody>
        </table>
    </motion.div>
    )
}

// Modal animado con AnimatePresence
export function AnimatedModal({ show, onClose, title, children, maxWidth = 'max-w-lg' }) {
    return (
    <AnimatePresence>
        {show && (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto"
            variants={backdropAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
            className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} p-6 my-4`}
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            >
            {title && (
                <motion.h3
                className="text-xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                >
                {title}
                </motion.h3>
            )}
            {children}
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>
    )
}

// Boton animado reutilizable
export function AnimatedButton({ onClick, disabled, className, children }) {
    return (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        className={className}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.96 }}
        transition={{ duration: 0.15 }}
    >
        {children}
    </motion.button>
    )
}

// Card animada para stats
export function StatCard({ icon, label, value, color, delay = 0 }) {
    return (
    <motion.div
        className="bg-white rounded-xl shadow p-6 flex items-center gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
    >
        <motion.div
        className={`${color} text-white text-3xl w-14 h-14 rounded-full flex items-center justify-center`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: delay + 0.1 }}
        >
        {icon}
        </motion.div>
        <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <motion.p
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
        >
            {value}
        </motion.p>
        </div>
    </motion.div>
    )
}