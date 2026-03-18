import { NavLink } from "react-router-dom"
import { HiHome } from "react-icons/hi"
import { HiClipboardDocumentList, HiDocumentText } from "react-icons/hi2"
import { FaMapMarkedAlt } from "react-icons/fa"

const BottomNav = () => {
    const menuItems = [
        { to: '/', label: 'Inicio', icon: <HiHome /> },
        { to: '/controles', label: 'Controles', icon: <HiClipboardDocumentList /> },
        { to: '/pruebas', label: 'Pruebas', icon: <HiDocumentText /> },
        { to: '/terrenos', label: 'Terrenos', icon: <FaMapMarkedAlt /> },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-16">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 text-xs font-medium transition-all duration-200
                            ${isActive
                                ? 'text-purple-600'
                                : 'text-gray-400'
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default BottomNav
