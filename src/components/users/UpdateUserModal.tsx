import { useState } from "react";
import type { User } from "@/services/userService";

interface UpdateUserModalProps {
  isOpen: boolean;
  user: User | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (
    id: string,
    data: {
      name: string;
      email: string;
      password?: string;
    }
  ) => void;
}

const UpdateUserModal = ({
  isOpen,
  user,
  isLoading,
  onClose,
  onSubmit,
}: UpdateUserModalProps) => {
  const [form, setForm] = useState(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
  }));

  if (!isOpen || !user) return null;

  const handleChange = (
    field: "name" | "email" | "password",
    value: string
  ): void => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const FloatingInput = ({
    label,
    type,
    value,
    onChange,
  }: {
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="
          peer w-full px-4 pt-5 pb-2 text-sm
          bg-gradient-to-br from-white to-gray-50
          border border-gray-200
          rounded-xl
          shadow-inner
          focus:outline-none
          focus:ring-2 focus:ring-primary/40
          focus:border-primary
          transition-all
        "
      />
      <label
        className="
          absolute left-4 top-2 text-xs
          text-gray-500
          transition-all
          peer-placeholder-shown:top-4
          peer-placeholder-shown:text-sm
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:text-primary
        "
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-[fadeIn_.2s_ease-out]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            Update User
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <FloatingInput
            label="Nama"
            type="text"
            value={form.name}
            onChange={(v) =>
              handleChange("name", v)
            }
          />

          <FloatingInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) =>
              handleChange("email", v)
            }
          />

          <FloatingInput
            label="Password (opsional)"
            type="password"
            value={form.password}
            onChange={(v) =>
              handleChange("password", v)
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl text-sm
              border border-gray-200
              hover:bg-gray-100
              transition
            "
          >
            Batal
          </button>

          <button
            disabled={isLoading}
            onClick={() =>
              onSubmit(user.id, {
                name: form.name,
                email: form.email,
                password:
                  form.password || undefined,
              })
            }
            className="
              px-5 py-2 rounded-xl text-sm
              bg-gradient-to-r from-primary to-blue-600
              text-white
              shadow-lg
              hover:scale-[1.02]
              active:scale-[0.98]
              transition
              disabled:opacity-50
            "
          >
            {isLoading
              ? "Updating..."
              : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
