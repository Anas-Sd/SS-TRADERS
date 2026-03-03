import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Info, Search, List, ChevronDown, ChevronRight, PlusCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import AddItemModal from './AddItemModal'

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [itemsOpen, setItemsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [items, setItems] = useState<any[]>([])
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)

    const fetchItems = async () => {
        const { data } = await supabase.from('items').select('*').order('name');
        if (data) setItems(data)
    }

    useEffect(() => {
        fetchItems()

        const subscription = supabase
            .channel('items_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
                fetchItems()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'About', path: '/about', icon: Info },
    ]

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false
        return location.pathname.startsWith(path)
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={clsx(
                "fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 w-[80%] max-w-[320px] md:w-[30%] overflow-y-auto flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 flex-1 flex flex-col gap-6">

                    {/* Global Search */}
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        if (searchQuery.trim()) {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                            setSearchQuery('')
                            setIsOpen(false)
                        } else {
                            navigate(`/search`)
                            setIsOpen(false)
                        }
                    }} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Type & press Enter..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-full py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground shadow-sm"
                        />
                    </form>

                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const active = isActive(link.path)
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    <Icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", active && "text-primary")} />
                                    {link.name}
                                </Link>
                            )
                        })}

                        {/* Items Dropdown */}
                        <div className="mt-2">
                            <button
                                onClick={() => setItemsOpen(!itemsOpen)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                    isActive('/items') || itemsOpen
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <List className={clsx("w-5 h-5 transition-transform group-hover:scale-110", (isActive('/items') || itemsOpen) && "text-primary")} />
                                    Items
                                </div>
                                {itemsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <div className={clsx(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                itemsOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                            )}>
                                <div className="pl-11 pr-3 py-1 flex flex-col gap-1 border-l-2 border-border ml-5 space-y-1">
                                    <Link
                                        to="/items"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-sm py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        View All Items
                                    </Link>
                                    {items.map(item => (
                                        <Link
                                            key={item.id}
                                            to={`/items/${item.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block text-sm py-1.5 text-muted-foreground hover:text-foreground transition-colors truncate"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    {user && (
                                        <button
                                            onClick={() => { setIsOpen(false); setIsAddItemModalOpen(true); }}
                                            className="flex items-center gap-2 text-sm py-1.5 text-primary hover:text-primary-600 transition-colors mt-2 font-medium"
                                        >
                                            <PlusCircle size={14} /> Add Item
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* User Bottom Status */}
                {user && (
                    <div className="p-4 border-t border-border mt-auto">
                        <div className="text-xs text-muted-foreground mb-1">Logged in as</div>
                        <div className="text-sm font-medium text-foreground truncate">{user.email}</div>
                    </div>
                )}
            </aside>

            <AddItemModal
                isOpen={isAddItemModalOpen}
                onClose={() => setIsAddItemModalOpen(false)}
                onSuccess={fetchItems}
            />
        </>
    )
}
