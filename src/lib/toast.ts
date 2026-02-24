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

// Helper functions dengan pengecekan safe
export const toast = {
  success: (message: string) => {
    if (window.__toast?.success) {
      window.__toast.success(message);
    } else {
      console.log("Toast success:", message);
    }
  },
  error: (message: string) => {
    if (window.__toast?.error) {
      window.__toast.error(message);
    } else {
      console.log("Toast error:", message);
    }
  },
  info: (message: string) => {
    if (window.__toast?.info) {
      window.__toast.info(message);
    } else {
      console.log("Toast info:", message);
    }
  },
};
