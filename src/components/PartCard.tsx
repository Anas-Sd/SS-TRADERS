import { useState, useCallback } from 'react'
import { X, Box, CheckCircle2, AlertCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import PartFormModal from './PartFormModal'
import ConfirmModal from './ConfirmModal'
import toast from 'react-hot-toast'

export default function PartCard({ part, onUpdate }: { part: any, onUpdate?: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { user } = useAuth()
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const isOutOfStock = parseInt(part.units) === 0 || part.units === '0' || part.units === 0

    const imagesList: string[] = Array.isArray(part.images)
        ? part.images
        : (typeof part.images === 'string' && part.images ? [part.images] : [])

    const displayImage = imagesList.length > 0 ? imagesList[0] : null

    const executeDelete = async () => {
        setIsDeleteModalOpen(false)
        // Delete images from bucket first
        if (imagesList && imagesList.length > 0) {
            const filesToDelete = imagesList.map(url => {
                try {
                    const parts = url.split('/')
                    return decodeURIComponent(parts[parts.length - 1])
                } catch (e) {
                    return ''
                }
            }).filter(Boolean)

            if (filesToDelete.length > 0) {
                const { error: storageError } = await supabase.storage.from('parts-images').remove(filesToDelete)
                if (storageError) {
                    toast.error("Warning: Could not delete part images. " + storageError.message)
                    console.error("Storage delete error:", storageError)
                }
            }
        }

        await supabase.from('parts').delete().eq('id', part.id)
        setIsModalOpen(false)
        if (onUpdate) onUpdate()
        else window.location.reload()
    }

    // Helper to resolve condition color
    const getConditionColor = (condition: string) => {
        switch (condition?.toLowerCase()) {
            case 'new': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
            case 'refurbished': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
            default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
        }
    }

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className={clsx(
                    "group relative border rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl",
                    isOutOfStock
                        ? "bg-destructive/10 border-destructive/50 ring-1 ring-destructive/20"
                        : "bg-card border-border hover:border-primary/50"
                )}
            >
                <div className="aspect-square w-full bg-secondary/30 relative overflow-hidden">
                    {displayImage ? (
                        <img src={displayImage} alt={part.name} loading="lazy" className={clsx("w-full h-full object-cover transition-transform duration-500 group-hover:scale-110", isOutOfStock && "grayscale")} />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Box className={clsx("w-12 h-12", isOutOfStock ? "text-destructive/30" : "text-muted-foreground/30")} />
                        </div>
                    )}

                    {/* Card Overlays */}
                    {isOutOfStock && (
                        <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                            Unavailable
                        </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                            Click for details &rarr;
                        </span>
                    </div>
                </div>

                <div className={clsx("p-4", isOutOfStock && "bg-destructive/5 text-destructive")}>
                    <h3 className={clsx("font-bold text-lg leading-tight truncate", isOutOfStock ? "text-destructive" : "text-foreground")}>
                        {part.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className={clsx("text-sm font-medium", isOutOfStock ? "text-destructive/80" : "text-muted-foreground")}>
                            Qty: {part.units}
                        </span>
                        {!isOutOfStock && (
                            <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", getConditionColor(part.condition))}>
                                {part.condition || 'Used'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="grid md:grid-cols-2 gap-0 h-full max-h-[85vh] overflow-y-auto">
                            <div className="bg-secondary/30 relative h-64 md:h-full min-h-[300px]">
                                {imagesList.length > 0 ? (
                                    <div className="overflow-hidden h-full rounded-l-3xl" ref={emblaRef}>
                                        <div className="flex h-full">
                                            {imagesList.map((imgUrl, i) => (
                                                <div className="flex-[0_0_100%] min-w-0 h-full relative" key={i}>
                                                    <img src={imgUrl} alt={`${part.name} - ${i + 1}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        {imagesList.length > 1 && (
                                            <>
                                                <button onClick={scrollPrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 text-foreground p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-sm border border-border">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button onClick={scrollNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 text-foreground p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-sm border border-border">
                                                    <ChevronRight size={20} />
                                                </button>
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/50 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-medium border border-border shadow-sm">
                                                    {imagesList.length} Images
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                                        <Box className="w-20 h-20 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={clsx("text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md", getConditionColor(part.condition))}>
                                            {part.condition || 'Used'}
                                        </span>
                                        {isOutOfStock ? (
                                            <span className="flex items-center gap-1 text-xs font-bold bg-destructive/10 text-destructive px-2.5 py-1 rounded-md">
                                                <AlertCircle size={14} /> Unavailable
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-md">
                                                <CheckCircle2 size={14} /> In Stock
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">{part.name}</h2>

                                    <div className="text-4xl font-light text-muted-foreground mb-6">
                                        {part.units} <span className="text-lg text-muted-foreground/60">units</span>
                                    </div>

                                    <div className="prose prose-sm dark:prose-invert">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                                        <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                                            {part.description || "No description provided for this component."}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3 text-sm bg-secondary/20 p-5 rounded-2xl border border-secondary/50">
                                        <div className="font-semibold text-foreground/90 uppercase tracking-widest text-xs">Contact for inquiry</div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                                            <a href="tel:9848125153" className="flex items-center gap-2 hover:text-primary transition-colors bg-background px-3 py-1.5 rounded-lg shadow-sm border border-border w-fit">
                                                <span>📞</span> <span className="font-medium">9848125153</span>
                                            </a>
                                            <a href="mailto:anassd303@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors bg-background px-3 py-1.5 rounded-lg shadow-sm border border-border w-fit">
                                                <span>✉️</span> <span className="font-medium">anassd303@gmail.com</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Authenticated User Actions */}
                                {user && (
                                    <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2.5 rounded-xl font-medium transition-colors"
                                        >
                                            <Edit size={16} /> Edit Part
                                        </button>
                                        <button
                                            onClick={() => setIsDeleteModalOpen(true)}
                                            className="flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 p-2.5 rounded-xl transition-colors"
                                            title="Delete Part"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <PartFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    itemId={part.item_id}
                    existingPart={part}
                    onSuccess={() => {
                        setIsEditModalOpen(false)
                        if (onUpdate) onUpdate()
                        else window.location.reload()
                    }}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Part"
                message={`Are you sure you want to delete "${part.name}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={executeDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </>
    )
}
