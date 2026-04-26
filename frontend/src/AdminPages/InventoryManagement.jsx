import React, { useState } from "react";

const InventoryManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");

  const [items] = useState([
    {
      id: 1,
      name: "Brake Pads",
      sku: "BP-77421",
      price: 124.5,
      stock: 6,
      supplier: "Global Friction",
      createdAt: 1,
    },
    {
      id: 2,
      name: "Oil Filter",
      sku: "OF-990",
      price: 18.99,
      stock: 142,
      supplier: "Prime Filtration",
      createdAt: 2,
    },
    {
      id: 3,
      name: "Spark Plug",
      sku: "SP-IR-4PK",
      price: 56.0,
      stock: 18,
      supplier: "Spark Point",
      createdAt: 3,
    },
    {
      id: 4,
      name: "Timing Belt",
      sku: "TB-V6-HDX",
      price: 89.75,
      stock: 48,
      supplier: "Transmission Pro",
      createdAt: 4,
    },
  ]);

  // FILTER + SEARCH + STOCK + SORT
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "low"
          ? item.stock < 20
          : item.stock >= 20;

      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (sort === "newest") return b.createdAt - a.createdAt;
      if (sort === "oldest") return a.createdAt - b.createdAt;
      return 0;
    });

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Inventory Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time tracking of vehicle components
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Export CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 md:items-center justify-between">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg text-sm"
        />

        {/* DROPDOWNS */}
        <div className="flex gap-3 flex-wrap">

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* STOCK FILTER */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="high">High Stock</option>
          </select>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Total SKU Items</p>
          <h2 className="text-2xl font-bold">14,208</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Low Stock Alerts</p>
          <h2 className="text-2xl font-bold text-amber-500">24</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Inventory Value</p>
          <h2 className="text-2xl font-bold">$1.24M</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Pending Shipments</p>
          <h2 className="text-2xl font-bold">156</h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="p-4">Part</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">

            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">

                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.sku}</td>
                <td className="p-4">${item.price}</td>

                <td
                  className={`p-4 font-semibold ${
                    item.stock < 20 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {item.stock}
                </td>

                <td className="p-4">{item.supplier}</td>

                <td className="p-4">
                  <button className="text-blue-600 mr-3">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default InventoryManagement;