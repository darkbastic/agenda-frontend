import { HiAcademicCap, HiClipboardCheck, HiLocationMarker, HiCalendar, HiExclamation } from 'react-icons/hi'

const tipoConfig = {
    control: {
        color: 'bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-700',
        icon: <HiClipboardCheck className="text-amber-500" />,
        label: 'Control',
    },
    prueba: {
        color: 'bg-blue-50 border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        icon: <HiAcademicCap className="text-blue-500" />,
        label: 'Prueba',
    },
    terreno: {
        color: 'bg-green-50 border-green-200',
        badge: 'bg-green-100 text-green-700',
        icon: <HiLocationMarker className="text-green-500" />,
        label: 'Terreno',
    },
}

const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-CL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC'
    })
}

const getDiasRestantes = (fechaStr) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const f = new Date(fechaStr)
    const fecha = new Date(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate())
    const diff = Math.round((fecha - hoy) / (1000 * 60 * 60 * 24))
    return diff
}

const EventCard = ({ evento }) => {
    const config = tipoConfig[evento.tipo] || tipoConfig.control
    const diasRestantes = getDiasRestantes(evento.fecha)
    const esUrgente = diasRestantes <= 3

    return (
        <div className={`rounded-xl border p-5 transition-all hover:shadow-md ${esUrgente ? 'border-red-300 bg-red-50 ring-1 ring-red-200' : config.color}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${config.badge}`}>
                        {config.icon}
                        {config.label}
                    </span>
                    {esUrgente && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-600 flex items-center gap-1 animate-pulse">
                            <HiExclamation />
                            {diasRestantes === 0 ? '¡Hoy!' : diasRestantes === 1 ? '¡Mañana!' : `${diasRestantes} días`}
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <HiCalendar className="text-gray-400" />
                    {formatFecha(evento.fecha)}
                </span>
            </div>


            <h3 className="text-lg font-bold text-gray-800">{evento.asignatura}</h3>

            {evento.descripcion && (
                <p className="text-sm text-gray-500 mt-1">{evento.descripcion}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
                {evento.contenido && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        📚 {evento.contenido}
                    </span>
                )}
                {evento.ponderacion && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium">
                        ⚖️ {evento.ponderacion}%
                    </span>
                )}
                {evento.lugar && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                        📍 {evento.lugar}
                    </span>
                )}
                {evento.direccion && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        🗺️ {evento.direccion}
                    </span>
                )}
            </div>
        </div>
    )
}

export default EventCard