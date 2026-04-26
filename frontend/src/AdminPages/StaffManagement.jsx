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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();

    const newStaff = {
      id: Date.now(),
      ...form,
    };

    setStaff([...staff, newStaff]);

    setForm({
      name: "",
      email: "",
      role: "",
      phone: "",
      status: "Active",
    });

    setIsModalOpen(false);
  };

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

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          + Add Staff
        </button>
      </div>

      {/* TABLE (same as yours) */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
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
              <tr key={person.id} className="border-t hover:bg-slate-50">

                <td className="p-4 font-medium">{person.name}</td>
                <td className="p-4">{person.email}</td>
                <td className="p-4">{person.role}</td>
                <td className="p-4">{person.phone}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    person.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {person.status}
                  </span>
                </td>

                <td className="p-4">
                  <button className="text-blue-600 mr-3">Edit</button>
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

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">

            <h2 className="text-xl font-bold mb-4">
              Add New Staff
            </h2>

            <form onSubmit={handleAddStaff} className="space-y-4">

              {/* NAME */}
              <input
                type="text"
                name="name"
                placeholder="Staff Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              {/* ROLE */}
              <input
                type="text"
                name="role"
                placeholder="Role (e.g. Sales Staff)"
                value={form.role}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              {/* PHONE */}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              />

              {/* STATUS */}
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Staff
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaffManagement;