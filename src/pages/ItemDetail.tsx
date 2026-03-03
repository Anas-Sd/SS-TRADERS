import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Search, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import PartCard from '../components/PartCard'
import PartFormModal from '../components/PartFormModal'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

export default function ItemDetail() {
    const { itemId } = useParams<{ itemId: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [item, setItem] = useState<any>(null)
    const [parts, setParts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isPartModalOpen, setIsPartModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const fetchItemDetails = async () => {
        setLoading(true)
        if (!itemId) return

        const { data: itemData } = await supabase.from('items').select('*').eq('id', itemId).single()
        if (itemData) setItem(itemData)

        const { data: partsData } = await supabase.from('parts').select('*').eq('item_id', itemId).order('name')
        if (partsData) setParts(partsData)

        setLoading(false)
    }

    useEffect(() => {
        if (itemId) fetchItemDetails()
    }, [itemId])

    const executeDelete = async () => {
        setIsDeleteModalOpen(false)
        // 1. Fetch parts to get their image URLs
        const { data: partsData } = await supabase.from('parts').select('images').eq('item_id', itemId)

        // 2. Delete images from bucket
        if (partsData && partsData.length > 0) {
            let allFilesToDelete: string[] = []
            partsData.forEach(p => {
                const imagesList: string[] = Array.isArray(p.images)
                    ? p.images
                    : (typeof p.images === 'string' && p.images ? [p.images] : [])

                const fileNames = imagesList.map(url => {
                    try {
                        const chunks = url.split('/')
                        return decodeURIComponent(chunks[chunks.length - 1])
                    } catch (e) {
                        return ''
                    }
                }).filter(Boolean)
                allFilesToDelete = [...allFilesToDelete, ...fileNames]
            })

            if (allFilesToDelete.length > 0) {
                const { error: storageError } = await supabase.storage.from('parts-images').remove(allFilesToDelete)
                if (storageError) {
                    toast.error("Warning: Could not delete all images from storage. " + storageError.message)
                    console.error("Storage delete error:", storageError)
                }
            }
        }

        // 3. Delete parts
        const { error: partsError } = await supabase.from('parts').delete().eq('item_id', itemId)
        if (!partsError) {
            // 4. Delete item
            await supabase.from('items').delete().eq('id', itemId)
            toast.success("Item and its parts deleted successfully")
            navigate('/items')
        } else {
            toast.error("Failed to delete parts")
        }
    }

    const filteredParts = parts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="text-center py-20 animate-in fade-in">
                <h2 className="text-2xl font-bold">Item not found</h2>
                <button onClick={() => navigate('/items')} className="mt-4 text-primary hover:underline">Go back to items</button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-6 animate-in fade-in">
            <button
                onClick={() => navigate('/items')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Items
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
                    <p className="text-muted-foreground mt-1">Manage parts associated with this item.</p>
                </div>

                {user && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsPartModalOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2"
                        >
                            <Plus size={16} /> Add Part
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Remove Item
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-8 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search parts locally..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                />
            </div>

            {filteredParts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-card/50">
                    <p className="text-muted-foreground">No parts found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {filteredParts.map(part => (
                        <PartCard key={part.id} part={part} onUpdate={fetchItemDetails} />
                    ))}
                </div>
            )}

            {itemId && (
                <PartFormModal
                    isOpen={isPartModalOpen}
                    onClose={() => setIsPartModalOpen(false)}
                    itemId={itemId}
                    onSuccess={fetchItemDetails}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Item"
                message="Are you sure you want to delete this item? ALL parts inside it will also be deleted."
                confirmText="Delete"
                onConfirm={executeDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    )
}
