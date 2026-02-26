import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  RefreshCw,
  Edit,
  Trash2,
  LayoutGrid,
  UserCircle,
} from "lucide-react";
import { divisionService, type Division } from "@/services/divisonService";
import DivisionModal from "@/components/divisions/DivisionModal";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/lib/toast";
import axios from "axios";

const DivisionsPage = () => {
  const { user } = useAuth();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const divData = await divisionService.getAll();
      setDivisions(divData);
      setFilteredDivisions(divData);
    } catch (error) {
      console.error("Error fetching division data:", error);
      toast.error("Gagal memuat data divisi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = divisions.filter((div) => {
      return (
        div.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (div.head || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredDivisions(filtered);
  }, [searchTerm, divisions]);


  const handleCreate = async (data: {
    name: string;
    organization_id: string;
    head?: string;
    description?: string;
  }) => {
    try {
      await divisionService.create(data);
      toast.success("Divisi berhasil ditambahkan");
      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Gagal menambahkan divisi",
        );
      } else {
        toast.error("Gagal menambahkan divisi");
      }
      throw error;
    }
  };

  const handleUpdate = async (data: {
    name?: string;
    organization_id?: string;
    head?: string;
    description?: string;
  }) => {
    if (!selectedDivision) return;
    try {
      await divisionService.update(selectedDivision.id, data);
      toast.success("Divisi berhasil diperbarui");
      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Gagal memperbarui divisi",
        );
      } else {
        toast.error("Gagal memperbarui divisi");
      }
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus divisi ini?")) return;
    try {
      await divisionService.delete(id);
      toast.success("Divisi berhasil dihapus");
      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Gagal menghapus divisi");
      } else {
        toast.error("Gagal menghapus divisi");
      }
    }
  };

  const openCreateModal = () => {
    setSelectedDivision(null);
    setIsModalOpen(true);
  };

  const openEditModal = (division: Division) => {
    setSelectedDivision(division);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const organizationId = user?.organization_id || "";

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="text-primary" size={28} />
            Manajemen Divisi
          </h2>
          <p className="text-muted-foreground">
            Kelola divisi utama dalam organisasi Anda.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
            title="Refresh data"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Tambah Divisi
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari divisi atau kepala divisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>

        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredDivisions.length === 0 ? (
          <div className="p-12 text-center">
            <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Tidak ada data
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Tidak ada divisi yang sesuai dengan pencarian"
                : "Belum ada divisi yang ditambahkan"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Nama Divisi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Kepala Divisi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDivisions.map((div) => (
                  <tr
                    key={div.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold">
                          {div.name[0]}
                        </div>
                        <span className="font-semibold text-foreground">
                          {div.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <UserCircle
                          size={16}
                          className="text-muted-foreground"
                        />
                        {div.head || "Belum ditentukan"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === div.id ? null : div.id,
                            );
                          }}
                          className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {dropdownOpen === div.id && (
                          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-32 bg-white rounded-lg shadow-lg border border-border z-10 py-1 text-left animate-in fade-in slide-in-from-right-2">
                            <button
                              onClick={() => openEditModal(div)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2"
                            >
                              <Edit size={16} className="text-primary" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(div.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-secondary text-red-600 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={selectedDivision ? handleUpdate : handleCreate}
        division={selectedDivision}
        organizationId={organizationId}
        title={selectedDivision ? "Edit Divisi" : "Tambah Divisi"}
      />
    </div>
  );
};

export default DivisionsPage;
