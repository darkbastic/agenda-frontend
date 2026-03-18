import { useEffect, useState } from "react";
import { HiPlus, HiMap } from "react-icons/hi";
import api from "../api/axios";
import TerrenoCard from "../components/TerrenoCard";
import TerrenoModal from "../components/TerrenoModal";
import ConfirmModal from "../components/ConfirmModal";

const Terrenos = () => {

    const [stats, setStats] = useState({ total: 0, proximos7: 0, esteMes: 0 });
    const [terrenos, setTerrenos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [eliminarId, setEliminarId] = useState(null);
    const [editarTerreno, setEditarTerreno] = useState(null);

    const handleDelete = (id) => {
        setEliminarId(id);
    }
    const confirmarDelete = () => {
        api.delete(`/terrenos/${eliminarId}`)
            .then(() => {
                cargarTerrenos();
                cargarStats();
                setEliminarId(null);
            })
            .catch((err) => {
                console.error('Error al eliminar:', err);
            })
    }

    const cargarTerrenos = () => {
        api.get('/terrenos').then((res) => {
            const ordenados = [...res.data.data].sort(
                (a, b) => new Date(a.fecha) - new Date(b.fecha)
            );
            setTerrenos(ordenados);
            setLoading(false);
        })
            .catch((err) => {
                console.error('Error al cargar terrenos:', err);
                setLoading(false);
            })
    }

    const cargarStats = () => {
        api.get('/dashboard').then((res) => {
            setStats({
                total: res.data.data.terrenos_total,
                proximos7: res.data.data.terrenos_proximos_7_dias,
                esteMes: res.data.data.terrenos_este_mes,
            });
        })
    }

    useEffect(() => {
        cargarTerrenos();
        cargarStats();
    }, [])

    return <>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Salidas a terreno</h1>
                <p className="text-gray-400 mt-1">Gestiona tus salidas a terreno</p>
            </div>
            <button
                onClick={() => { setEditarTerreno(null); setMostrarModal(true); }}
                className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors cursor-pointer shadow-sm font-medium"
            >
                <HiPlus className="text-lg" />
                Agregar Salida
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.total}</p>
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

        {loading && <p className="mt-6 text-center text-gray-500">Cargando salidas...</p>}

        {!loading && terrenos.length === 0 && (
            <div className="mt-10 text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <HiMap className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No tienes salidas a terreno aún</h3>
                <p className="text-sm text-gray-400 mt-1">Agrega tu primera salida para empezar</p>
            </div>
        )}

        <div className="flex flex-col gap-4 mt-6">
            {terrenos.map((terreno) => (
                <TerrenoCard
                    key={terreno.id}
                    terreno={terreno}
                    onEdit={(t) => { setEditarTerreno(t); setMostrarModal(true); }}
                    onDelete={handleDelete}
                />
            ))}
        </div>

        {mostrarModal && (
            <TerrenoModal
                onClose={() => setMostrarModal(false)}
                terreno={editarTerreno}
                onSave={() => { cargarTerrenos(); cargarStats(); }}
            />
        )}

        {eliminarId && (
            <ConfirmModal
                mensaje="Esta salida a terreno se eliminará."
                onConfirm={confirmarDelete}
                onCancel={() => setEliminarId(null)}
            />
        )}
    </>
}

export default Terrenos;