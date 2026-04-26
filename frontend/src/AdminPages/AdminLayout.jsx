import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Boxes,
  Truck,
  BarChart3,
  FileText,
  Plus,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Staff Management", path: "/admin/staff", icon: Users },
    { name: "Inventory", path: "/admin/inventorymanagement", icon: Boxes },
    { name: "Vendors", path: "/admin/vendormanagement", icon: Truck },
    { name: "Reports", path: "/admin/reports", icon: BarChart3 },
    { name: "Invoices", path: "/admin/invoices", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">

      {/* SIDEBAR */}
      <aside className="w-[260px] fixed left-0 top-0 h-screen bg-white border-r flex flex-col">

        {/* Logo */}
        <div className="p-5 border-b">
          <h1 className="text-xl font-black text-blue-600">
            AutoPart Admin
          </h1>
          <p className="text-xs text-slate-400">
            Inventory & Sales System
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t space-y-2">

          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold">
            <Plus size={18} />
            Add Part
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-[260px]">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
          <h2 className="font-semibold text-slate-700">
            Admin Dashboard
          </h2>

          <div className="text-sm text-slate-500">
            AutoPart System
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;