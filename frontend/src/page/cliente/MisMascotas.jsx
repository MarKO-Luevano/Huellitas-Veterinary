import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function MisMascotas() {
    const { user } = useAuth()
    const [mascotas, setMascotas] = useState([])
    const [expandedId, setExpandedId] = useState(null) // Para controlar cuál está desplegada
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    if (!user?.id) return
    
    api.get(`/mascotas/usuario/${user.id}`)
        .then(res => {
        setMascotas(res.data)
        setLoading(false)
        })
        .catch(err => {
        console.error("Error al obtener mascotas:", err)
        setLoading(false)
        })
    }, [user])

    const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
    }

    if (loading) return <p className="p-6 text-blue-800">Cargando tus peluditos... 🐾</p>

    return (
    <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🐾 Mis Mascotas
        </h2>

        {mascotas.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-2xl text-center border-2 border-dashed border-blue-200">
            <p className="text-blue-600 text-lg">Aún no tienes mascotas registradas en HuellitasDB.</p>
        </div>
        ) : (
        <div className="space-y-4">
            {mascotas.map((m) => (
            <div key={m.idMascota} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
              {/* Cabecera (Lo que siempre se ve) */}
                <div 
                onClick={() => toggleExpand(m.idMascota)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-2xl w-12 h-12 rounded-full flex items-center justify-center">
                    🐶
                    </div>
                    <div>
                    <h3 className="font-bold text-xl text-gray-800">{m.nombre}</h3>
                    <p className="text-gray-500 text-sm">{m.especie?.nombre || 'Mascota'} · {m.edad} años</p>
                    </div>
                </div>
                <span className={`text-2xl transition-transform duration-300 ${expandedId === m.idMascota ? 'rotate-180' : ''}`}>
                    ▼
                </span>
                </div>

              {/* Detalle Desplegable */}
                <div className={`transition-all duration-300 ease-in-out ${expandedId === m.idMascota ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-gray-50`}>
                <div className="p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Raza</p>
                    <p className="text-gray-800">{m.raza?.nombre || 'No especificada'}</p>
                    </div>
                    <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Peso</p>
                    <p className="text-gray-800">{m.peso} kg</p>
                    </div>
                    <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Sexo</p>
                    <p className="text-gray-800">{m.sexo === 'M' ? 'Macho ♂' : 'Hembra ♀'}</p>
                    </div>
                    <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Fecha de Nacimiento</p>
                    <p className="text-gray-800">{m.fechaNacimiento || 'No registrada'}</p>
                    </div>
                    {m.observaciones && (
                    <div className="col-span-1 md:col-span-2 mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <p className="text-sm text-yellow-700 font-bold">Notas médicas:</p>
                        <p className="text-sm text-yellow-800 italic">{m.observaciones}</p>
                    </div>
                    )}
                </div>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    )
}