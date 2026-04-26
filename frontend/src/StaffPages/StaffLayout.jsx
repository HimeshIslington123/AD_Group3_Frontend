import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Car,
  ShoppingCart,
  Users,
  Search,
  FileText,
  LogOut,
} from "lucide-react";

const StaffLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/staff", icon: LayoutDashboard },

    // 6 - register customer
    { name: "Add Customer", path: "/staff/addcustomer", icon: UserPlus },

    // 7 - sell parts + invoice
    { name: "Sales & Invoice", path: "/staff/salesinvoice", icon: ShoppingCart },

    // 8 - view customer details/history
    { name: "Customers", path: "/staff/customers", icon: Users },

    // 9 - reports
    { name: "Reports", path: "/staff/reports", icon: FileText },

    // 10 - search customers
    { name: "Customer details", path: "/staff/customerdetails", icon: Search },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f7ff]">

      {/* SIDEBAR */}
      <aside className="w-[260px] fixed left-0 top-0 h-screen bg-white border-r flex flex-col">

        {/* LOGO */}
        <div className="p-5 border-b">
          <h1 className="text-xl font-black text-blue-600">
            AutoPart Staff
          </h1>
          <p className="text-xs text-slate-400">
            Sales & Customer System
          </p>
        </div>

        {/* MENU */}
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

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-[260px]">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h2 className="font-semibold text-slate-700">
            Staff Dashboard 👨‍🔧
          </h2>

          <div className="text-sm text-slate-500">
            Vehicle Sales System
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StaffLayout;