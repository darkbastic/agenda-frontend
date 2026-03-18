import { useState } from 'react'
import { HiX } from 'react-icons/hi'
import api from '../api/axios'

const formatFechaInput = (fechaStr) => {
    if (!fechaStr) return ''
    const fecha = new Date(fechaStr)
    return fecha.toISOString().split('T')[0]
}

const TerrenoModal = ({ onClose, onSave, terreno }) => {

    const esEditar = !!terreno

    const [form, setForm] = useState({
        asignatura: terreno?.asignatura || '',
        lugar: terreno?.lugar || '',
        direccion: terreno?.direccion || '',
        fecha: formatFechaInput(terreno?.fecha),
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const request = esEditar
            ? api.put(`/terrenos/${terreno.id}`, form)
            : api.post('/terrenos', form)

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
                    <h2 className="text-xl font-bold text-gray-800">{esEditar ? 'Editar Salida' : 'Nueva Salida'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        <HiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                        <input
                            type="text" name="asignatura" value={form.asignatura} onChange={handleChange} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ej: Geología"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                        <input
                            type="text" name="lugar" value={form.lugar} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ej: Cerro Santa Lucía"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text" name="direccion" value={form.direccion} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ej: Av. Alameda 123"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date" name="fecha" value={form.fecha} onChange={handleChange} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition-colors font-semibold cursor-pointer">
                        {esEditar ? 'Actualizar Salida' : 'Guardar Salida'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TerrenoModal
