import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import BottomNav from "./BottomNav"

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
                {/* Header móvil - solo visible en pantallas pequeñas */}
                <div className="md:hidden text-center mb-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        UniAgenda
                    </h1>
                </div>
                <Outlet />
            </main>
            <BottomNav />
        </div>
    )
}

export default Layout