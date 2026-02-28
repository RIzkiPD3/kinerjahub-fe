import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

// Definisikan tipe untuk window dengan properti opsional
declare global {
  interface Window {
    __toast?: {
      success: (message: string) => void;
      error: (message: string) => void;
      info: (message: string) => void;
    };
  }
}

// Komponen Toast individual
const Toast = ({ message, type, onClose, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  const backgrounds = {
    success:
      "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
    error: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-2 ${backgrounds[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium text-foreground">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-muted-foreground hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Main Toast Container Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Expose methods globally dengan type safety
  useEffect(() => {
    window.__toast = {
      success: (msg: string) => show(msg, "success"),
      error: (msg: string) => show(msg, "error"),
      info: (msg: string) => show(msg, "info"),
    };

    // Cleanup
    return () => {
      window.__toast = undefined;
    };
  }, []);

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => remove(toast.id)}
        />
      ))}
    </>
  );
};
