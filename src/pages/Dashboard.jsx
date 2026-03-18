import { useState, useEffect } from 'react'
import { HiCalendar } from 'react-icons/hi'
import api from '../api/axios'
import EventCard from '../components/EventCard'

const getSaludo = () => {
    const hora = new Date().getHours()
    if (hora < 12) return 'Buenos días'
    if (hora < 19) return 'Buenas tardes'
    return 'Buenas noches'
}

const Dashboard = () => {

    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get('/eventos')
            .then((res) => {
                const hoy = new Date()
                const en14Dias = new Date()
                en14Dias.setDate(hoy.getDate() + 14)

                const filtrados = res.data.data
                    .filter((e) => {
                        const fecha = new Date(e.fecha)
                        return fecha >= hoy && fecha <= en14Dias
                    })
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

                setEventos(filtrados)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error al cargar eventos:', err)
                setError('No se pudieron cargar los eventos')
                setLoading(false)
            })
    }, [])

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    {getSaludo()} Jo🔬
                </h1>
                <p className="text-gray-400 mt-1">Resumen de tus actividades académicas, bienvenida</p>
            </div>

            <div className='mt-8'>
                <h2 className='text-xl font-semibold text-gray-700 flex items-center gap-2'>
                    <HiCalendar />
                    Próximos 14 días
                </h2>
            </div>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 p-5 animate-pulse">
                            <div className="flex justify-between mb-3">
                                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                            </div>
                            <div className="h-5 w-40 bg-gray-200 rounded mt-2" />
                            <div className="h-4 w-56 bg-gray-100 rounded mt-2" />
                            <div className="flex gap-2 mt-3">
                                <div className="h-5 w-24 bg-gray-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-6 text-center text-red-500 bg-red-50 p-4 rounded-xl">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {eventos.length > 0 ? (
                        eventos.map((evento) => (
                            <EventCard key={`${evento.tipo}-${evento.id}`} evento={evento} />
                        ))
                    ) : (
                        <p className="text-gray-400 col-span-2 text-center py-8">
                            No hay eventos en los próximos 14 días 🎉
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default Dashboard;