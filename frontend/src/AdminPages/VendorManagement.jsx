import React, { useState } from "react";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "Global Auto Parts Ltd",
      email: "contact@globalauto.com",
      phone: "9801234567",
      location: "Kathmandu",
      status: "Active",
    },
    {
      id: 2,
      name: "Prime Spare Suppliers",
      email: "info@primespare.com",
      phone: "9811122233",
      location: "Lalitpur",
      status: "Inactive",
    },
  ]);

  const handleDelete = (id) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Vendor Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage supplier details and partnerships
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          + Add Vendor
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Total Vendors</p>
          <h2 className="text-2xl font-bold">{vendors.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Active Vendors</p>
          <h2 className="text-2xl font-bold text-green-600">
            {vendors.filter(v => v.status === "Active").length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Inactive Vendors</p>
          <h2 className="text-2xl font-bold text-red-500">
            {vendors.filter(v => v.status === "Inactive").length}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-t hover:bg-slate-50">

                  <td className="p-4 font-medium">{vendor.name}</td>
                  <td className="p-4">{vendor.email}</td>
                  <td className="p-4">{vendor.phone}</td>
                  <td className="p-4">{vendor.location}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        vendor.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button className="text-blue-600 mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default VendorManagement;