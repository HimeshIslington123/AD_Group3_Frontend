import React from "react";

const InventoryManagement = () => {
  return (
    <div className="flex min-h-screen text-on-surface">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] border-r bg-white shadow-sm z-50">
        <div className="flex flex-col h-full py-6 space-y-2">

          <div className="px-6 mb-8">
            <h2 className="text-lg font-bold text-blue-600">
              AutoPart Logistics
            </h2>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            <a className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 border-l-4 border-blue-600">
              Inventory
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-gray-600">
              Orders
            </a>
          </nav>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] bg-background">

        {/* Header */}
        <header className="flex justify-between items-center px-8 h-16 border-b bg-white">
          <input
            className="w-full max-w-md px-4 py-2 bg-gray-100 rounded-lg"
            placeholder="Search..."
          />
          <div>Profile</div>
        </header>

        {/* Page */}
        <div className="p-8">

          <h1 className="text-2xl font-bold mb-6">
            Inventory Management
          </h1>

          {/* Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p>Total SKU</p>
              <h3 className="text-xl font-bold">14,208</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p>Low Stock</p>
              <h3 className="text-xl font-bold">24</h3>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4">Part</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-4">Brake Pads</td>
                  <td className="p-4">BP-77421</td>
                  <td className="p-4">$124.50</td>
                  <td className="p-4 text-red-500">6</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">Oil Filter</td>
                  <td className="p-4">OF-990</td>
                  <td className="p-4">$18.99</td>
                  <td className="p-4 text-green-500">142</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

export default InventoryManagement;