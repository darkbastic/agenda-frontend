import { useEffect, useState } from "react"
import { HiPlus, HiChevronLeft, HiChevronRight, HiCalendar, HiCheck } from "react-icons/hi"
import { HiTrash, HiPencilSquare } from "react-icons/hi2"
import api from "../api/axios"
import EstudioModal from "../components/EstudioModal"
import ConfirmModal from "../components/ConfirmModal"

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const DIAS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const formatFecha = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const normalizeFechaBackend = (fechaStr) => {
    const date = new Date(fechaStr)
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, '0')
    const d = String(date.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const getInicioDia = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

const getSemana = (inicio) => {
    const dias = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(inicio)
        d.setDate(inicio.getDate() + i)
        dias.push(d)
    }
    return dias
}

const esHoy = (date) => {
    const hoy = new Date()
    return date.getDate() === hoy.getDate() &&
        date.getMonth() === hoy.getMonth() &&
        date.getFullYear() === hoy.getFullYear()
}

const Calendario = () => {
    const [fechaInicio, setFechaInicio] = useState(getInicioDia(new Date()))
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
    const [editarEstudio, setEditarEstudio] = useState(null)
    const [eliminarId, setEliminarId] = useState(null)

    const semana = getSemana(fechaInicio)

    const cargarSemana = () => {
        setLoading(true)
        api.get(`/estudio/semana?fecha_inicio=${formatFecha(fechaInicio)}`)
            .then((res) => {
                const data = (res.data.data || []).map(evento => ({
                    ...evento,
                    fecha: normalizeFechaBackend(evento.fecha)
                }))
                setEventos(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error al cargar semana:', err)
                setEventos([])
                setLoading(false)
            })
    }

    useEffect(() => {
        cargarSemana()
    }, [fechaInicio])

    const semanaAnterior = () => {
        const nuevo = new Date(fechaInicio)
        nuevo.setDate(nuevo.getDate() - 7)
        setFechaInicio(nuevo)
    }

    const semanaSiguiente = () => {
        const nuevo = new Date(fechaInicio)
        nuevo.setDate(nuevo.getDate() + 7)
        setFechaInicio(nuevo)
    }

    const irAHoy = () => {
        setFechaInicio(getInicioDia(new Date()))
    }

    const getEventosDia = (fecha) => {
        const fechaStr = formatFecha(fecha)
        return eventos.filter(e => e.fecha === fechaStr)
    }

    const abrirCrear = (fecha) => {
        setEditarEstudio(null)
        setFechaSeleccionada(formatFecha(fecha))
        setMostrarModal(true)
    }

    const abrirEditar = (estudio) => {
        setEditarEstudio(estudio)
        setFechaSeleccionada(null)
        setMostrarModal(true)
    }

    const toggleCompletado = (evento) => {
        api.put(`/estudio/estado/${evento.id}`)
            .then(() => cargarSemana())
            .catch((err) => console.error('Error al actualizar:', err))
    }

    const confirmarDelete = () => {
        api.delete(`/estudio/${eliminarId}`)
            .then(() => {
                cargarSemana()
                setEliminarId(null)
            })
            .catch((err) => {
                console.error('Error al eliminar:', err)
            })
    }

    const ultimoDia = semana[6]
    const rangoTexto = fechaInicio.getMonth() === ultimoDia.getMonth()
        ? `${fechaInicio.getDate()} – ${ultimoDia.getDate()} de ${MESES[fechaInicio.getMonth()]} ${fechaInicio.getFullYear()}`
        : `${fechaInicio.getDate()} ${MESES[fechaInicio.getMonth()].slice(0, 3)} – ${ultimoDia.getDate()} ${MESES[ultimoDia.getMonth()].slice(0, 3)} ${ultimoDia.getFullYear()}`

    return <>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Calendario de Estudio</h1>
                <p className="text-gray-400 mt-1">Planifica tu semana de estudio</p>
            </div>
            <button
                onClick={irAHoy}
                className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors cursor-pointer shadow-sm font-medium whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
                <HiCalendar className="text-lg" />
                Hoy
            </button>
        </div>

        <div className="flex items-center justify-between mt-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <button
                onClick={semanaAnterior}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
            >
                <HiChevronLeft className="text-xl" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700 text-center">{rangoTexto}</h2>
            <button
                onClick={semanaSiguiente}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
            >
                <HiChevronRight className="text-xl" />
            </button>
        </div>

        {loading && <p className="mt-6 text-center text-gray-500">Cargando semana...</p>}

        {!loading && (
            <div className="hidden md:grid grid-cols-7 gap-3 mt-6">
                {semana.map((dia, i) => {
                    const eventosDia = getEventosDia(dia)
                    const hoy = esHoy(dia)
                    return (
                        <div
                            key={i}
                            className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col min-h-[220px]
                                ${hoy ? 'border-violet-300 shadow-md shadow-violet-100' : 'border-gray-100 shadow-sm'}`}
                        >
                            <div className={`p-3 text-center border-b ${hoy ? 'border-violet-200 bg-violet-50' : 'border-gray-50'} rounded-t-2xl`}>
                                <p className={`text-xs font-medium uppercase tracking-wide ${hoy ? 'text-violet-600' : 'text-gray-400'}`}>
                                    {DIAS[dia.getDay()]}
                                </p>
                                <p className={`text-xl font-bold mt-0.5 ${hoy ? 'text-violet-600' : 'text-gray-700'}`}>
                                    {dia.getDate()}
                                </p>
                            </div>

                            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                {eventosDia.length === 0 && (
                                    <p className="text-xs text-gray-300 text-center mt-4">Sin estudio</p>
                                )}
                                {eventosDia.map((evento) => (
                                    <div
                                        key={evento.id}
                                        className={`group rounded-xl p-2.5 border-l-4 border hover:shadow-md transition-all duration-200 cursor-pointer
                                            ${evento.completado
                                                ? 'bg-green-50 border-green-300 border-l-green-500'
                                                : 'bg-gradient-to-r from-violet-50 to-blue-50 border-violet-100 border-l-violet-500'}`}
                                        onClick={() => abrirEditar(evento)}
                                    >
                                        <div className="flex items-start gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleCompletado(evento) }}
                                                className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                                                    ${evento.completado
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-violet-300 hover:border-violet-500'}`}
                                            >
                                                {evento.completado && <HiCheck className="text-[10px]" />}
                                            </button>
                                            <div className="min-w-0 flex-1">
                                                <p className={`text-xs font-semibold truncate ${evento.completado ? 'line-through text-green-600' : 'text-violet-700'}`}>{evento.asignatura}</p>
                                                <p className={`text-[11px] mt-0.5 truncate ${evento.completado ? 'line-through text-green-400' : 'text-gray-500'}`}>{evento.contenido}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); abrirEditar(evento) }}
                                                className="p-1 rounded-lg hover:bg-violet-100 text-violet-500 cursor-pointer"
                                            >
                                                <HiPencilSquare className="text-sm" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEliminarId(evento.id) }}
                                                className="p-1 rounded-lg hover:bg-red-100 text-red-400 cursor-pointer"
                                            >
                                                <HiTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-2 pt-0">
                                <button
                                    onClick={() => abrirCrear(dia)}
                                    className="w-full flex items-center justify-center gap-1 text-xs text-violet-500 hover:text-violet-700 hover:bg-violet-50 py-2 rounded-xl transition-colors cursor-pointer font-medium"
                                >
                                    <HiPlus className="text-sm" />
                                    Agregar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}

        {/* Vista Mobile - Stack vertical */}
        {!loading && (
            <div className="md:hidden flex flex-col gap-4 mt-6">
                {semana.map((dia, i) => {
                    const eventosDia = getEventosDia(dia)
                    const hoy = esHoy(dia)
                    return (
                        <div
                            key={i}
                            className={`bg-white rounded-2xl border transition-all duration-200
                                ${hoy ? 'border-violet-300 shadow-md shadow-violet-100' : 'border-gray-100 shadow-sm'}`}
                        >
                            {/* Header del día */}
                            <div className={`flex items-center justify-between p-4 border-b ${hoy ? 'border-violet-200 bg-violet-50' : 'border-gray-50'} rounded-t-2xl`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                                        ${hoy ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {dia.getDate()}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${hoy ? 'text-violet-700' : 'text-gray-700'}`}>
                                            {DIAS_FULL[dia.getDay()]}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {MESES[dia.getMonth()]}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => abrirCrear(dia)}
                                    className="p-2 bg-violet-100 text-violet-600 rounded-xl hover:bg-violet-200 transition-colors cursor-pointer"
                                >
                                    <HiPlus className="text-lg" />
                                </button>
                            </div>

                            {/* Eventos */}
                            <div className="p-3 space-y-2">
                                {eventosDia.length === 0 && (
                                    <p className="text-sm text-gray-300 text-center py-3">Sin estudio agendado</p>
                                )}
                                {eventosDia.map((evento) => (
                                    <div
                                        key={evento.id}
                                        className={`flex items-center justify-between rounded-xl p-3 border-l-4 border transition-all
                                            ${evento.completado
                                                ? 'bg-green-50 border-green-300 border-l-green-500'
                                                : 'bg-gradient-to-r from-violet-50 to-blue-50 border-violet-100 border-l-violet-500'}`}
                                    >
                                        <button
                                            onClick={() => toggleCompletado(evento)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mr-3 transition-colors cursor-pointer
                                                ${evento.completado
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-violet-300 hover:border-violet-500'}`}
                                        >
                                            {evento.completado && <HiCheck className="text-xs" />}
                                        </button>
                                        <div className="flex-1 min-w-0" onClick={() => abrirEditar(evento)}>
                                            <p className={`text-sm font-semibold truncate ${evento.completado ? 'line-through text-green-600' : 'text-violet-700'}`}>{evento.asignatura}</p>
                                            <p className={`text-xs mt-0.5 truncate ${evento.completado ? 'line-through text-green-400' : 'text-gray-500'}`}>{evento.contenido}</p>
                                        </div>
                                        <div className="flex gap-1 ml-2 shrink-0">
                                            <button
                                                onClick={() => abrirEditar(evento)}
                                                className="p-2 rounded-xl hover:bg-violet-100 text-violet-500 cursor-pointer"
                                            >
                                                <HiPencilSquare className="text-base" />
                                            </button>
                                            <button
                                                onClick={() => setEliminarId(evento.id)}
                                                className="p-2 rounded-xl hover:bg-red-100 text-red-400 cursor-pointer"
                                            >
                                                <HiTrash className="text-base" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        )}

        {/* Modal crear/editar */}
        {mostrarModal && (
            <EstudioModal
                onClose={() => setMostrarModal(false)}
                estudio={editarEstudio}
                fechaDefault={fechaSeleccionada}
                onSave={() => cargarSemana()}
            />
        )}

        {/* Modal confirmar eliminación */}
        {eliminarId && (
            <ConfirmModal
                mensaje="Este estudio agendado se eliminará."
                onConfirm={confirmarDelete}
                onCancel={() => setEliminarId(null)}
            />
        )}
    </>
}

export default Calendario
