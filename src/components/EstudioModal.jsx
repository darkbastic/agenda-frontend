import { useState } from 'react'
import { HiX } from 'react-icons/hi'
import api from '../api/axios'

const formatFechaInput = (fechaStr) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr + 'T00:00:00')
    return fecha.toISOString().split('T')[0]
}

const EstudioModal = ({ onClose, onSave, estudio, fechaDefault }) => {

    const esEditar = !!estudio

    const [form, setForm] = useState({
        asignatura: estudio?.asignatura || '',
        contenido: estudio?.contenido || '',
        fecha: esEditar ? formatFechaInput(estudio.fecha) : (fechaDefault || ''),
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const request = esEditar
            ? api.put(`/estudio/${estudio.id}`, form)
            : api.post('/estudio', form)

        request.then((res) => {
            onSave(res.data)
            onClose()
        })
            .catch((err) => {
                console.error('Error al guardar:', err)
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800">{esEditar ? 'Editar Estudio' : 'Nuevo Estudio'}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <HiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                        <input
                            type="text"
                            name="asignatura"
                            value={form.asignatura}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Ej: Matemáticas"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                        <input
                            type="text"
                            name="contenido"
                            value={form.contenido}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Ej: Capítulo 3 - Derivadas"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={form.fecha}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 text-white py-2.5 rounded-xl hover:bg-violet-700 transition-colors font-semibold cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : esEditar ? 'Actualizar Estudio' : 'Guardar Estudio'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EstudioModal
