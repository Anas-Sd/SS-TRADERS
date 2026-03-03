import { Outlet, useLocation } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import AddItemModal from '../components/AddItemModal'

export default function Items() {
    const location = useLocation()
    const isIndex = location.pathname === '/items'

    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
    const { user } = useAuth()

    const fetchItems = async () => {
        setLoading(true)
        const { data } = await supabase.from('items').select('*').order('name')
        if (data) setItems(data)
        setLoading(false)
    }

    useEffect(() => {
        if (isIndex) {
            fetchItems()
        }
    }, [isIndex])

    if (!isIndex) {
        return <Outlet />
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Items</h1>
                    <p className="text-muted-foreground mt-2">Browse the complete inventory structure.</p>
                </div>
                {user && (
                    <button
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        Add New Item
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-card border border-border rounded-xl shadow-sm">
                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No Items Found</h3>
                    <p className="text-muted-foreground mt-1">There are no items in the database yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {items.map(item => (
                        <Link
                            key={item.id}
                            to={`/items/${item.id}`}
                            className="group bg-card border border-border hover:border-primary/50 rounded-2xl p-6 transition-all hover:shadow-lg flex flex-col items-start gap-4"
                        >
                            <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    View parts inside &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <AddItemModal
                isOpen={isAddItemModalOpen}
                onClose={() => setIsAddItemModalOpen(false)}
                onSuccess={fetchItems}
            />
        </div>
    )
}
