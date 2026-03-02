import {
  Users,
  Building,
  Briefcase,
  Settings,
  LogOut,
  Bell,
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  FolderKanban,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOrgOpen, setIsOrgOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Ringkasan",
      exact: true,
    },
    {
      label: "Organization",
      icon: <Building size={20} />,
      isDropdown: true,
      isOpen: isOrgOpen,
      setOpen: setIsOrgOpen,
      subItems: [
        {
          path: "/dashboard/divisions",
          icon: <Briefcase size={18} />,
          label: "Division",
        },
        {
          path: "/dashboard/departments",
          icon: <Building size={18} />,
          label: "Department",
        },
        {
          path: "/dashboard/users",
          icon: <Users size={18} />,
          label: "User",
        },
      ],
    },
    {
      path: "/dashboard/projects",
      icon: <FolderKanban size={20} />,
      label: "Proyek",
    },
    {
      path: "/dashboard/attendance",
      icon: <CalendarDays size={20} />,
      label: "Absensi",
    },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isAnySubItemActive = (subItems: any[]) => {
    return subItems.some((item) => isActive(item.path));
  };

  return (
    <div className="flex h-screen bg-secondary overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shadow-xl z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Kinerja<span className="text-accent">Hub</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item, index) => {
            if (item.isDropdown) {
              const active = isAnySubItemActive(item.subItems || []);
              return (
                <div key={index} className="space-y-1">
                  <button
                    onClick={() => item.setOpen?.(!item.isOpen)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active || item.isOpen
                      ? "bg-white/10"
                      : "hover:bg-white/5 text-white/70 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform duration-200 ${item.isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${item.isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    {item.subItems?.map((subItem) => {
                      const subActive = isActive(subItem.path);
                      return (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${subActive
                            ? "bg-white/20 text-white"
                            : "hover:bg-white/5 text-white/60 hover:text-white"
                            }`}
                        >
                          {subItem.icon}
                          <span className="text-sm font-medium">
                            {subItem.label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const active = isActive(item.path!, item.exact);
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                  ? "bg-white/20"
                  : "hover:bg-white/5 text-white/70 hover:text-white"
                  }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight size={16} className="ml-auto" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white">
            <Settings size={20} />
            <span className="font-medium">Pengaturan</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 transition-all mt-2"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-end px-8 z-10">
          <div className="flex items-center gap-6">
            <button className="relative text-muted-foreground hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">
                  {user?.name || "User KinerjaHub"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {user?.role === "admin"
                    ? "Administrator"
                    : user?.role === "koordinator"
                      ? "Koordinator"
                      : "Staff"}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-primary/20">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto bg-secondary/30">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
