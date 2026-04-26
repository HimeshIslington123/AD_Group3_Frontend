import React from "react";

const InventoryManagement = () => {
  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Inventory Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time tracking of vehicle components
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-slate-50">
            Filters
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            Export CSV
          </button>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="p-4">Part Details</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Supplier</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">

              {/* ROW 1 */}
              <tr className="border-t">
                <td className="p-4 font-medium">Brake Pads</td>
                <td className="p-4">BP-77421</td>
                <td className="p-4">$124.50</td>
                <td className="p-4 text-red-500 font-semibold">6</td>
                <td className="p-4">Global Friction</td>
                <td className="p-4">
                  <button className="text-blue-600 mr-3">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>

              {/* ROW 2 */}
              <tr className="border-t">
                <td className="p-4 font-medium">Oil Filter</td>
                <td className="p-4">OF-990</td>
                <td className="p-4">$18.99</td>
                <td className="p-4 text-green-600 font-semibold">142</td>
                <td className="p-4">Prime Filtration</td>
                <td className="p-4">
                  <button className="text-blue-600 mr-3">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default InventoryManagement;