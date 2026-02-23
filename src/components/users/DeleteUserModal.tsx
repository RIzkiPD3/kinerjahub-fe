import React from "react";

interface DeleteUserModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h3 className="text-lg font-bold mb-4">
          Hapus User?
        </h3>

        <p className="text-sm text-muted-foreground mb-6">
          Data user akan dihapus permanen. Yakin?
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm rounded-lg bg-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </button>

          <button
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
