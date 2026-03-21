import { useEffect, useState } from "react";
import { HiPlus, HiAcademicCap } from "react-icons/hi";
import api from "../api/axios";
import PruebaCard from "../components/PruebaCard";
import PruebaModal from "../components/PruebaModal";
import ConfirmModal from "../components/ConfirmModal";

const Pruebas = () => {

    const [stats, setStats] = useState({ total: 0, proximos7: 0, esteMes: 0 });
    const [pruebas, setPruebas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [eliminarId, setEliminarId] = useState(null);
    const [editarPrueba, setEditarPrueba] = useState(null);

    const handleDelete = (id) => {
        setEliminarId(id);
    }
    const confirmarDelete = () => {
        api.delete(`/pruebas/${eliminarId}`)
            .then(() => {
                cargarPruebas();
                cargarStats();
                setEliminarId(null);
            })
            .catch((err) => {
                console.error('Error al eliminar:', err);
            })
    }

    const cargarPruebas = () => {
        api.get('/pruebas').then((res) => {
            const ordenados = [...res.data.data].sort(
                (a, b) => new Date(a.fecha) - new Date(b.fecha)
            );
            setPruebas(ordenados);
            setLoading(false);
        })
            .catch((err) => {
                console.error('Error al cargar pruebas:', err);
                setLoading(false);
            })
    }

    const cargarStats = () => {
        api.get('/dashboard').then((res) => {
            setStats({
                total: res.data.data.pruebas_total,
                proximos7: res.data.data.pruebas_proximos_7_dias,
                esteMes: res.data.data.pruebas_este_mes,
            });
        })
    }

    useEffect(() => {
        cargarPruebas()
        cargarStats()
    }, [])

    return <>

        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Pruebas</h1>
                <p className="text-gray-400 mt-1">Gestiona tus pruebas</p>
            </div>
            <button
                onClick={() => { setEditarPrueba(null); setMostrarModal(true); }}
                className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors cursor-pointer shadow-sm font-medium whitespace-nowrap shrink-0"
            >
                <HiPlus className="text-lg" />
                Agregar Prueba
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.total}</p>
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

        {loading && <p className="mt-6 text-center text-gray-500">Cargando pruebas...</p>}

        {!loading && pruebas.length === 0 && (
            <div className="mt-10 text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <HiAcademicCap className="text-blue-500 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No tienes pruebas aún</h3>
                <p className="text-sm text-gray-400 mt-1">Agrega tu primera prueba para empezar</p>
            </div>
        )}

        <div className="flex flex-col gap-4 mt-6">
            {pruebas.map((prueba) => (
                <PruebaCard
                    key={prueba.id}
                    prueba={prueba}
                    onEdit={(p) => { setEditarPrueba(p); setMostrarModal(true); }}
                    onDelete={handleDelete}
                />
            ))}
        </div>

        {mostrarModal && (
            <PruebaModal
                onClose={() => setMostrarModal(false)}
                prueba={editarPrueba}
                onSave={() => { cargarPruebas(); cargarStats(); }}
            />
        )}

        {eliminarId && (
            <ConfirmModal
                mensaje="Esta prueba se eliminará."
                onConfirm={confirmarDelete}
                onCancel={() => setEliminarId(null)}
            />
        )}
    </>
}

export default Pruebas;