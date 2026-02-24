import { AlertTriangle, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const DeleteConfirmModal = ({
    isOpen,
    title,
    description,
    confirmLabel = "Hapus",
    cancelLabel = "Batal",
    onConfirm,
    onCancel,
    isLoading = false,
}: DeleteConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                            <AlertTriangle size={24} />
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="p-6 bg-secondary/30 flex flex-col-reverse sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-white border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
