import React, { useState } from "react";

const StaffManagement = () => {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@autopart.com",
      role: "Sales Staff",
      phone: "9801112233",
      status: "Active",
    },
    {
      id: 2,
      name: "Sara Lama",
      email: "sara@autopart.com",
      role: "Inventory Staff",
      phone: "9811223344",
      status: "Active",
    },
  ]);

  const handleDelete = (id) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Staff Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage staff accounts, roles, and access control
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          + Add Staff
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Total Staff</p>
          <h2 className="text-2xl font-bold">{staff.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Active Staff</p>
          <h2 className="text-2xl font-bold text-green-600">
            {staff.filter((s) => s.status === "Active").length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-slate-500">Inactive Staff</p>
          <h2 className="text-2xl font-bold text-red-500">
            {staff.filter((s) => s.status === "Inactive").length}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {staff.map((person) => (
                <tr
                  key={person.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4 font-medium">
                    {person.name}
                  </td>

                  <td className="p-4">{person.email}</td>

                  <td className="p-4">{person.role}</td>

                  <td className="p-4">{person.phone}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        person.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button className="text-blue-600 mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
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

export default StaffManagement;