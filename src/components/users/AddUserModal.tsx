import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { createUser, type CreateUserPayload } from "@/services/userService";
import { getDepartments } from "@/services/departementService";
import { getDivisionsByDepartment } from "@/services/divisonService";
import { getRoles, createRole, type Role } from "@/services/roleService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizationId: string;
}

interface Department {
  id: string;
  name: string;
}

interface Division {
  id: string;
  name: string;
}

export default function AddUserModal({
  open,
  onClose,
  onSuccess,
  organizationId,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [roleId, setRoleId] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [showCreateRole, setShowCreateRole] = useState(false);

  useEffect(() => {
    if (open) {
      getDepartments().then(setDepartments);
      getRoles().then(setRoles);
    }
  }, [open]);

  useEffect(() => {
    if (!departmentId) {
      setDivisions([]);
      return;
    }

    const fetchDivisions = async () => {
      const data = await getDivisionsByDepartment(departmentId);
      setDivisions(data);
    };

    fetchDivisions();
  }, [departmentId]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      const newRole = await createRole(newRoleName);
      setRoles((prev) => [...prev, newRole]);
      setRoleId(newRole.id);
      setNewRoleName("");
      setShowCreateRole(false);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      alert("Nama, email, dan password wajib diisi!");
      return;
    }

    if (!roleId) {
      alert("Role wajib dipilih!");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateUserPayload = {
        name,
        email,
        password,
        phone_number: phone,
        organization_id: organizationId,
        department_id: departmentId,
        division_id: divisionId,
        role_id: roleId,
      };

      await createUser(payload);
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Gagal membuat user");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setDepartmentId("");
    setDivisionId("");
    setRoleId("");
    setNewRoleName("");
    setShowCreateRole(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="sticky top-0 right-4 float-right -mr-4 -mt-6 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
          title="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-1">Tambah User Baru</h2>
        <p className="text-sm text-muted-foreground mb-6">Isi form di bawah untuk membuat user baru</p>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password *
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nomor Telepon
            </label>
            <input
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Departemen
            </label>
            <select
              title="Pilih Departemen"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setDivisionId("");
              }}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            >
              <option value="">Pilih Departemen</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Division */}
          {departmentId && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Divisi
              </label>
              <select
                title="Pilih Divisi"
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              >
                <option value="">Pilih Divisi</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role *
            </label>
            <select
              title="Pilih Role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            >
              <option value="">Pilih Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Create Role Button */}
          <button
            type="button"
            onClick={() => setShowCreateRole(!showCreateRole)}
            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
          >
            <Plus size={16} />
            Buat Role Baru
          </button>

          {/* Create Role Form */}
          {showCreateRole && (
            <div className="flex gap-2 p-4 bg-secondary/50 rounded-lg">
              <input
                type="text"
                placeholder="Nama role baru"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Tambah
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Membuat..." : "Buat User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}