import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, Package, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import LoginModal from './LoginModal'
import toast from 'react-hot-toast'

interface NavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
    const { user } = useAuth()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Logged out successfully")
            // Ensure UI updates reliably
            window.location.reload()
        }
    }

    const [showExpiredMsg, setShowExpiredMsg] = useState(false)

    useEffect(() => {
        const checkExpired = () => {
            if (localStorage.getItem('sessionExpired') === 'true') {
                setShowExpiredMsg(true)
                localStorage.removeItem('sessionExpired')
                setIsLoginModalOpen(true)
            }
        }
        window.addEventListener('sessionExpired', checkExpired)
        checkExpired()
        return () => window.removeEventListener('sessionExpired', checkExpired)
    }, [])

    return (
        <>
            {showExpiredMsg && (
                <div className="fixed top-16 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium py-2 px-4 text-center z-40 backdrop-blur-md flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle size={16} /> Session expired due to inactivity. Please log in again.
                </div>
            )}
            <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 md:px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Package className="text-primary w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                            SS Traders
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                        <Link to={'/'}>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-full text-sm font-medium transition-all"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:block">Log Out</span>
                            </button>
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <LogIn size={16} />
                            <span className="hidden sm:block">Log In</span>
                        </button>
                    )}
                </div>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    )
}
