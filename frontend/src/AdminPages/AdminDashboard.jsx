import React from "react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Staff",
      value: 12,
      icon: "group",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Vendors",
      value: 8,
      icon: "local_shipping",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Parts",
      value: 2450,
      icon: "inventory_2",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: 18,
      icon: "warning",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Invoices",
      value: 156,
      icon: "receipt_long",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Revenue",
      value: "$38,200",
      icon: "payments",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Business performance overview & system analytics
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-slate-500">{item.title}</p>
                <h2 className="text-2xl font-bold mt-1">
                  {item.value}
                </h2>
              </div>

              <div className={`p-3 rounded-lg ${item.bg}`}>
                <span className={`material-symbols-outlined ${item.color}`}>
                  {item.icon}
                </span>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* INSIGHTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Business Insight */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-3">
            Business Insights
          </h3>

          <ul className="space-y-3 text-sm text-slate-600">

            <li>📊 Monthly revenue increased by <b>12.5%</b></li>
            <li>📦 Inventory turnover rate is improving</li>
            <li>⚠️ 18 parts are below minimum stock level</li>
            <li>👨‍💼 Staff productivity is stable</li>

          </ul>
        </div>

        {/* System Actions */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-bold mb-3">
            Admin Actions
          </h3>

          <div className="space-y-3 text-sm">

            <div className="p-3 bg-slate-50 rounded-lg">
              Generate financial reports (Daily / Monthly / Yearly)
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              Manage staff roles & registrations
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              Create purchase invoices for stock updates
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              Vendor management (CRUD operations)
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;