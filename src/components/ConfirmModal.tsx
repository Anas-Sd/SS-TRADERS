import { AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = true
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/30">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 bg-background hover:bg-secondary border border-border rounded-lg text-sm font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={clsx(
                            "flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-sm",
                            isDestructive
                                ? "bg-destructive hover:bg-destructive/90"
                                : "bg-primary hover:bg-primary/90"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
