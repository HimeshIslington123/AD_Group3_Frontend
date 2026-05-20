import React, { useState, useEffect } from "react";
import axios from "axios";

const CUSTOMER_API = "http://localhost:5216/api/customer";
const REGISTER_API = "http://localhost:5216/api/auth/register";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  vehicleNumber: "",
  brand: "",
  model: "",
  year: "",
  type: "",
  role: "Customer",
};

const AddCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // GET ALL
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(CUSTOMER_API);
      setCustomers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setIsOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (customer) => {
    setForm(customer);
    setEditId(customer.id);
    setIsOpen(true);
  };

  // SUBMIT (ADD / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 ONLY FIX HERE
    const payload = {
      ...form,
      year: Number(form.year),
    };

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${CUSTOMER_API}/${editId}`, payload);
      } else {
        // CREATE
        await axios.post(REGISTER_API, payload);
      }

      setIsOpen(false);
      fetchCustomers();
      setForm(emptyForm);
    } catch (err) {
      console.log("🔥 BACKEND ERROR:", err.response?.data); // IMPORTANT
      alert("Operation failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await axios.delete(`${CUSTOMER_API}/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-gray-500 text-sm">
            Manage all registered customers
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Customer
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">SN</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c, index) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">{c.fullName}</td>

                  <td className="p-3 text-gray-600">{c.email}</td>

                  <td className="p-3">{c.phone}</td>

                  <td className="p-3 text-gray-600">
                    {c.brand} {c.model} ({c.vehicleNumber})
                  </td>

                  <td className="p-3 text-gray-600">{c.address}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg">

            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Customer" : "Add Customer"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border p-2 rounded"
                  required
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-2 rounded"
                  required
                />
              </div>

              {!editId && (
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="border p-2 rounded w-full"
                  required
                />
              )}

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-2 rounded"
                  required
                />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="border p-2 rounded"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Year"
                  className="border p-2 rounded"
                  required
                />

                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Type (Bike, Car...)"
                  className="border p-2 rounded"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="Vehicle No"
                  className="border p-2 rounded"
                />

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="border p-2 rounded"
                />

                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Model"
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddCustomer;