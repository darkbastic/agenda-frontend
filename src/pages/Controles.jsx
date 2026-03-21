import { useEffect, useState } from "react";
import { HiPlus, HiClipboardList } from "react-icons/hi";
import api from "../api/axios";
import ControlCard from "../components/ControlCard";
import ControlModal from "../components/ControlModal";
import ConfirmModal from "../components/ConfirmModal";

const Controles = () => {

    const [controles, setControles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [eliminarId, setEliminarId] = useState(null);
    const [stats, setStats] = useState({ total: 0, proximos7: 0, esteMes: 0 });
    const [editarControl, setEditarControl] = useState(null);

    const cargarControles = () => {
        api.get('/controles').then((res) => {
            const ordenados = [...res.data.data].sort(
                (a, b) => new Date(a.fecha) - new Date(b.fecha)
            );
            setControles(ordenados);
            setLoading(false);
        })
            .catch((err) => {
                console.error('Error al cargar controles:', err);
                setLoading(false);
            })
    }

    const cargarStats = () => {
        api.get('/dashboard').then((res) => {
            setStats({
                total: res.data.data.controles_total,
                proximos7: res.data.data.controles_proximos_7_dias,
                esteMes: res.data.data.controles_este_mes,
            });
        })
            .catch((err) => {
                console.error('Error al cargar stats:', err);
            })
    }

    useEffect(() => {
        cargarControles();
        cargarStats();
    }, [])

    const handleDelete = (id) => {
        setEliminarId(id);
    }

    const confirmarDelete = () => {
        api.delete(`/controles/${eliminarId}`)
            .then(() => {
                cargarControles();
                cargarStats();
                setEliminarId(null);
            })
            .catch((err) => {
                console.error('Error al eliminar:', err);
            })
    }

    const handleEdit = (control) => {
        setEditarControl(control);
        setMostrarModal(true);
    }

    const handleAdd = () => {
        setEditarControl(null)
        setMostrarModal(true);
    }

    return <>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Controles</h1>
                <p className="text-gray-400 mt-1">Gestiona tus controles</p>
            </div>
            <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors cursor-pointer shadow-sm font-medium whitespace-nowrap shrink-0"
            >
                <HiPlus className="text-lg" />
                Agregar Control
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.total}</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                <p className="text-sm text-gray-500">Próximos 7 días</p>
                <p className="text-2xl font-bold text-violet-600 mt-1">{stats.proximos7}</p>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                <p className="text-sm text-gray-500">Este mes</p>
                <p className="text-2xl font-bold text-cyan-600 mt-1">{stats.esteMes}</p>
            </div>
        </div>

        {loading && (
            <div className="mt-6 text-center text-gray-500">
                <p>Cargando controles...</p>
            </div>
        )}

        {!loading && controles.length === 0 && (
            <div className="mt-10 text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <HiClipboardList className="text-amber-500 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No tienes controles aún</h3>
                <p className="text-sm text-gray-400 mt-1">Agrega tu primer control para empezar</p>
            </div>
        )}

        <div className="flex flex-col gap-4 mt-6">
            {controles.map((control) => (
                <ControlCard
                    key={control.id}
                    control={control}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}
        </div>

        {eliminarId && (
            <ConfirmModal
                mensaje="Este control se eliminará."
                onConfirm={confirmarDelete}
                onCancel={() => setEliminarId(null)}
            />
        )}

        {mostrarModal && (
            <ControlModal
                onClose={() => setMostrarModal(false)}
                control={editarControl}
                onSave={() => {
                    cargarControles()
                    cargarStats()
                }}
            />
        )}
    </>
}

export default Controles;