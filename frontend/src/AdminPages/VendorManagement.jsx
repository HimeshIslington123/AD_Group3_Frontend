import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorManagement = () => {
  const API_URL = "http://localhost:5216/api/vendor";
  const token = localStorage.getItem("token");

  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // ✅ NEW

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "Active",
  });

  // ✅ FETCH
  const fetchVendors = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendors(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ✅ INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ CREATE + UPDATE (same function)
  const handleAddVendor = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // 🔥 UPDATE
        await axios.put(
          `${API_URL}/${editingId}`,
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.location,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // 🔥 CREATE
        await axios.post(
          API_URL,
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.location,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      fetchVendors();

      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        status: "Active",
      });

      setEditingId(null); // reset
      setIsModalOpen(false);

    } catch (err) {
      console.error(err);
      alert("Error saving vendor");
    }
  };

  // ✅ EDIT CLICK
  const handleEdit = (vendor) => {
    setForm({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      location: vendor.address,
      status: "Active",
    });

    setEditingId(vendor.id);
    setIsModalOpen(true);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchVendors();
    } catch (err) {
      console.error(err);
      alert("Error deleting vendor");
    }
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

        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
        >
          + Add Vendor
        </button>
      </div>

      {/* STATS (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p>Total Vendors</p>
          <h2 className="text-2xl font-bold">{vendors.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p>Active Vendors</p>
          <h2 className="text-2xl font-bold text-green-600">
            {vendors.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p>Inactive Vendors</p>
          <h2 className="text-2xl font-bold text-red-500">0</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Vendor Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Address</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-t">

                <td className="p-4">{vendor.name}</td>
                <td className="p-4">{vendor.email}</td>
                <td className="p-4">{vendor.phone}</td>
                <td className="p-4">{vendor.address}</td>

                <td className="p-4">
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="text-blue-600 mr-3"
                  >
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

      {/* MODAL (same UI, just title changes) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[500px] rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Vendor" : "Add Vendor"}
            </h2>

            <form onSubmit={handleAddVendor} className="space-y-4">

              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />

              <input
                name="location"
                placeholder="Address"
                value={form.location}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default VendorManagement;