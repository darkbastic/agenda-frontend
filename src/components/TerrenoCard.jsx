import { HiMap, HiCalendar, HiPencil, HiTrash, HiLocationMarker } from 'react-icons/hi'

const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC'
    })
}

const getDiasRestantes = (fechaStr) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const f = new Date(fechaStr)
    const fecha = new Date(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate())
    return Math.round((fecha - hoy) / (1000 * 60 * 60 * 24))
}

const TerrenoCard = ({ terreno, onEdit, onDelete }) => {
    const dias = getDiasRestantes(terreno.fecha)
    const esUrgente = dias >= 0 && dias <= 3

    return (
        <div className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-1 flex gap-4 ${esUrgente ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'}`}>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <HiMap className="text-green-600 text-xl" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{terreno.asignatura}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                            <HiCalendar />
                            {formatFecha(terreno.fecha)}
                            {esUrgente && (
                                <span className="ml-2 text-xs font-bold text-red-500 animate-pulse">
                                    {dias === 0 ? '¡Hoy!' : dias === 1 ? '¡Mañana!' : `en ${dias} días`}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(terreno)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <HiPencil className="text-lg" />
                        </button>
                        <button
                            onClick={() => onDelete(terreno.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <HiTrash className="text-lg" />
                        </button>
                    </div>
                </div>

                <div className="mt-3 space-y-1.5">
                    {terreno.lugar && (
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-green-600">Lugar: </span>
                            {terreno.lugar}
                        </p>
                    )}
                    {terreno.direccion && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <span className="font-semibold text-teal-600 flex items-center gap-1 inline-flex">
                                <HiLocationMarker /> Dirección:
                            </span>{' '}
                            {terreno.direccion}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TerrenoCard
