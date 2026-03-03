import { useState, useEffect } from 'react'
import { X, Upload, Save, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import imageCompression from 'browser-image-compression'
import toast from 'react-hot-toast'

interface PartFormModalProps {
    isOpen: boolean
    onClose: () => void
    itemId: string
    existingPart?: any
    onSuccess?: () => void
}

export default function PartFormModal({ isOpen, onClose, itemId, existingPart, onSuccess }: PartFormModalProps) {
    const [name, setName] = useState('')
    const [units, setUnits] = useState('1')
    const [condition, setCondition] = useState('Used')
    const [description, setDescription] = useState('')
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (existingPart) {
            setName(existingPart.name || '')
            setUnits(existingPart.units?.toString() || '0')
            setCondition(existingPart.condition || 'Used')
            setDescription(existingPart.description || '')
            const exImages = Array.isArray(existingPart.images) ? existingPart.images : (existingPart.images ? [existingPart.images] : [])
            setExistingImages(exImages)
        } else {
            setName('')
            setUnits('1')
            setCondition('Used')
            setDescription('')
            setExistingImages([])
        }
        setImageFiles([])
        setImagePreviews([])
    }, [existingPart, isOpen])

    if (!isOpen) return null

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setImageFiles(prev => [...prev, ...files])

            const previews = files.map(f => URL.createObjectURL(f))
            setImagePreviews(prev => [...prev, ...previews])
        }
    }

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const uploadImages = async (files: File[]) => {
        const uploadedUrls: string[] = []

        for (const file of files) {
            // Compress Image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }
            try {
                const compressedFile = await imageCompression(file, options)
                const fileExt = compressedFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('parts-images')
                    .upload(fileName, compressedFile)

                if (uploadError) throw uploadError

                const { data } = supabase.storage.from('parts-images').getPublicUrl(fileName)
                uploadedUrls.push(data.publicUrl)
            } catch (error) {
                console.error("Error compressing/uploading image:", error)
                throw new Error("Failed to upload an image")
            }
        }
        return uploadedUrls
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)

        try {
            let finalImageUrls = [...existingImages]

            if (imageFiles.length > 0) {
                const newUrls = await uploadImages(imageFiles)
                finalImageUrls = [...finalImageUrls, ...newUrls]
            }

            const payload = {
                item_id: itemId,
                name: name.trim(),
                units: units.toString(),
                condition,
                description: description.trim(),
                images: finalImageUrls
            }

            let error = null
            if (existingPart) {
                const oldImages = Array.isArray(existingPart.images) ? existingPart.images : (existingPart.images ? [existingPart.images] : [])
                const imagesToDelete = oldImages.filter((img: string) => !existingImages.includes(img))

                if (imagesToDelete.length > 0) {
                    const filesToDelete = imagesToDelete.map((url: string) => {
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
                            toast.error("Warning: Could not delete old images from storage. " + storageError.message)
                            console.error("Storage delete error:", storageError)
                        }
                    }
                }
                const { error: updateError } = await supabase
                    .from('parts')
                    .update(payload)
                    .eq('id', existingPart.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('parts')
                    .insert([payload])
                error = insertError
            }

            if (error) {
                console.error('Error saving part:', error)
                toast.error('Error saving part: ' + error.message)
            } else {
                toast.success(existingPart ? 'Part updated successfully!' : 'Part added successfully!')
                if (onSuccess) onSuccess()
                onClose()
            }
        } catch (error: any) {
            console.error('Error saving part:', error)
            toast.error('Error saving part: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-xl rounded-2xl shadow-xl border border-border overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-secondary/10">
                    <h2 className="text-xl font-semibold">{existingPart ? 'Update Part' : 'Add New Part'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors relative z-10 bg-background shadow-sm border border-border">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Part Images</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {existingImages.map((url, idx) => (
                                <div key={`ex-${idx}`} className="relative h-24 rounded-xl border border-border overflow-hidden group">
                                    <img src={url} alt="Part" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(idx)}
                                        className="absolute top-1 right-1 bg-background/80 hover:bg-destructive hover:text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {imagePreviews.map((preview, idx) => (
                                <div key={`prev-${idx}`} className="relative h-24 rounded-xl border border-border overflow-hidden group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute top-1 right-1 bg-background/80 hover:bg-destructive hover:text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <label className="h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                                <Upload className="w-6 h-6 text-muted-foreground/70 mb-1" />
                                <span className="text-xs text-muted-foreground font-medium">Add Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Upload transparent/clear images. Will be automatically compressed.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2 sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Capacitor 100uF"
                                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="units" className="block text-sm font-medium text-foreground">Units Available</label>
                            <input
                                id="units"
                                type="text"
                                required
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="condition" className="block text-sm font-medium text-foreground">Condition</label>
                            <select
                                id="condition"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                            >
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                                <option value="Refurbished">Refurbished</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
                        <textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide details about the part, specifications, etc."
                            className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                        />
                    </div>
                </form>

                <div className="p-4 sm:p-6 border-t border-border flex justify-end gap-3 bg-card mt-auto z-10 sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {existingPart ? 'Save Changes' : 'Add Part'}
                    </button>
                </div>
            </div>
        </div>
    )
}
