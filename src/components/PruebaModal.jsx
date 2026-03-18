import { useState } from 'react'
import { HiX } from 'react-icons/hi'
import api from '../api/axios'

const formatFechaInput = (fechaStr) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr)
    return fecha.toISOString().split('T')[0]
}

const PruebaModal = ({ onClose, onSave, prueba }) => {

    const esEditar = !!prueba

    const [form, setForm] = useState({
        asignatura: prueba?.asignatura || '',
        descripcion: prueba?.descripcion || '',
        contenido: prueba?.contenido || '',
        fecha: formatFechaInput(prueba?.fecha),
        ponderacion: prueba?.ponderacion || '',
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const request = esEditar
            ? api.put(`/pruebas/${prueba.id}`, form)
            : api.post('/pruebas', form)

        request.then((res) => {
            onSave(res.data);
            onClose();
        })
            .catch((err) => {
                console.error('Error al guardar:', err);
            })
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800">{esEditar ? 'Editar Prueba' : 'Nueva Prueba'}</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Ej: Prueba parcial"
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
                            placeholder="Ej: Capítulos 1-3"
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ponderación (%)</label>
                        <input
                            type="number"
                            name="ponderacion"
                            value={form.ponderacion}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="Ej: 30"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white py-2.5 rounded-xl hover:bg-violet-700 transition-colors font-semibold cursor-pointer"
                    >
                        {esEditar ? 'Actualizar Prueba' : 'Guardar Prueba'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PruebaModal
