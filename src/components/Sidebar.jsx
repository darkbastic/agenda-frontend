import { FaMapMarkedAlt } from "react-icons/fa"
import { HiHome } from "react-icons/hi"
import { HiClipboardDocumentList, HiDocumentText } from "react-icons/hi2"
import { NavLink } from "react-router-dom"


const Sidebar = () => {

    const menuItems = [
        { to: '/', label: 'Inicio', icon: <HiHome /> },
        { to: '/controles', label: 'Controles', icon: <HiClipboardDocumentList /> },
        { to: '/pruebas', label: 'Pruebas', icon: <HiDocumentText /> },
        { to: '/terrenos', label: 'Terrenos', icon: <FaMapMarkedAlt /> },
    ]
    return (
        <aside className="hidden md:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col p-6">
            {/* Logo */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    UniAgenda
                </h1>
                <p className="text-sm text-gray-400">Gestión Académica</p>
            </div>
            {/* Navegación */}
            <nav className="flex flex-col gap-2 flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-200'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar