import React from "react";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen text-on-surface bg-[#f8f9ff]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] border-r bg-white border-slate-200 shadow-sm z-50 flex flex-col py-6 space-y-2">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-black text-blue-600 tracking-tight">
            AutoPart Logistics
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Warehouse Management
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            ["dashboard", "Dashboard", true],
            ["inventory_2", "Inventory"],
            ["shopping_cart", "Orders"],
            ["group", "Customers"],
            ["local_shipping", "Vendors"],
            ["analytics", "Reports"],
          ].map(([icon, label, active]) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="px-4 mt-auto space-y-4">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold">
            <span className="material-symbols-outlined">add</span>
            Add New Part
          </button>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm">
              <span className="material-symbols-outlined">help</span>
              Support
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-sm">
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-[260px] min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border w-96">
            <span className="material-symbols-outlined">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full"
              placeholder="Command-K to search parts..."
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2">
              <span className="material-symbols-outlined">settings</span>
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">Alex Rivera</p>
                <p className="text-[10px] text-slate-500">Ops Manager</p>
              </div>

              <img
                className="w-10 h-10 rounded-full border-2 border-blue-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYeMqYoR8LITwtAIzeI4h2lm2JquqpcMQUUmUOSeC6IsmQb0IwLPWoHuWC6AM9WAbHpa4Zh4U3yy1S4pOMUJitvfoO9T2TCJX8FCuzg2ZuxzNm1uUWGOGw2RJqkux9JilSqhMAldKsKULQ0kFVgDR-tTTnz_VIWSNjzoMRcDG92pvShjRHrYHVIkNvKusd421qwWiwS0jbkHBgthEllwYq0hjynTip2VPIWXolQAkV9cCnxsf5YkpXBc2UjXP3VoBly4raynRgn9Y"
                alt="profile"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="p-8 space-y-8 max-w-[1440px] mx-auto">
          <h2 className="text-3xl font-semibold">Overview</h2>
          <p className="text-slate-500">
            Real-time status of your logistics network.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["Total Sales", "$142,850.00", "payments", "+12.5%", "green"],
              ["Total Parts", "24,512", "precision_manufacturing", "Steady"],
              ["Low Stock Alerts", "18 Items", "warning", "Urgent", "red"],
              ["Revenue", "$38,200.45", "trending_up", "+8.2%", "green"],
            ].map(([title, value, icon, status]) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <p className="text-sm text-slate-500 mt-4">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-xs mt-2">{status}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;