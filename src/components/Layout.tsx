import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
            <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <div className="flex flex-1 pt-16 h-[calc(100vh-4rem)]">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 bg-secondary/20 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
