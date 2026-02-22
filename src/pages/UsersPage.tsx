import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState, useEffect, } from "react";
import { getUsers, deleteUser, updateUser, type User } from "@/services/userService";
import DeleteUserModal from "@/components/users/DeleteUserModal";
import UpdateUserModal from "@/components/users/UpdateUserModal";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [updateTarget, setUpdateTarget] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  const handleDelete = async (): Promise<void> => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(true);

      await deleteUser(deleteTargetId);

      setUsers((prev) =>
        prev.filter((user) => user.id !== deleteTargetId)
      );

      setDeleteTargetId(null);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (
    id: string,
    data: {
      name: string;
      email: string;
      password?: string;
    }
  ): Promise<void> => {
    try {
      setIsUpdating(true);

      const updated = await updateUser(
        id,
        data
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
              ...u,
              name: updated.name,
              email: updated.email,
            }
            : u
        )
      );

      setUpdateTarget(null);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsUpdating(false);
    }
  };



  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }


  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="text-primary" size={28} />
            Manajemen User
          </h2>
          <p className="text-muted-foreground">
            Kelola akses pengguna, peran, dan informasi profil karyawan.
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={18} />
          Tambah User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-sm border border-border p-6 relative"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(
                    activeMenuId === user.id
                      ? null
                      : user.id
                  );
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <MoreVertical size={18} />
              </button>

              {/* Dropdown Menu */}
              {activeMenuId === user.id && (
                <div
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-md z-20"
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setUpdateTarget(user);
                      console.log(
                        "Edit user",
                        user.id
                      );
                      setActiveMenuId(null);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setDeleteTargetId(
                        user.id
                      );
                      setActiveMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>


            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-bold text-foreground">
                  {user.name}
                </h4>

                <p className="text-sm text-primary font-medium">
                  {user.role?.name ?? "No Role"}
                </p>

                <div className="mt-1 px-2 py-0.5 bg-secondary rounded text-[10px] font-bold text-muted-foreground uppercase w-fit">
                  Dept ID: {user.department_id}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} />
                {user.email}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} />
                -
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} />
                Org: {user.organization_id}
              </div>
            </div>
          </div>
        ))}


        {/* Add shortcut card */}
        <button className="bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 p-6 flex flex-col items-center justify-center gap-4 hover:bg-primary/10 transition-all group">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <p className="font-bold text-primary">Tambah User Baru</p>
            <p className="text-xs text-muted-foreground">Cepat dan mudah</p>
          </div>
        </button>
      </div>

      {/* Quick Search */}
      <div className="bg-white p-4 rounded-xl border border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Search className="text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama, email, atau departemen..."
            className="bg-transparent border-none outline-none text-sm w-96 text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Ketik{" "}
            <kbd className="px-2 py-1 bg-secondary rounded border border-border font-sans font-bold">
              CMD + F
            </kbd>{" "}
            untuk cari cepat
          </span>
        </div>
      </div>
      <DeleteUserModal
        isOpen={!!deleteTargetId}
        isLoading={isDeleting}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
      <UpdateUserModal
        key={updateTarget?.id}
        isOpen={updateTarget !== null}
        user={updateTarget}
        isLoading={isUpdating}
        onClose={() => setUpdateTarget(null)}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default UsersPage;
