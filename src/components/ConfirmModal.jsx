import { HiExclamation } from 'react-icons/hi'

const ConfirmModal = ({ mensaje, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <HiExclamation className="text-red-500 text-2xl" />
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">¿Estás segura?</h3>
                <p className="text-sm text-gray-500 mb-6">{mensaje}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium cursor-pointer"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
