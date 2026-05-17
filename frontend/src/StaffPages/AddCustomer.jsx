import React, { useState, useEffect } from "react";
import axios from "axios";

const CUSTOMER_API = "http://localhost:5216/api/customer";
const REGISTER_API = "http://localhost:5216/api/auth/register";

const AddCustomer = () => {
  const [form, setForm] = useState({
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
  });

  const [customers, setCustomers] = useState([]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(CUSTOMER_API);
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: "Customer",
        phone: form.phone,
        address: form.address,
        vehicleNumber: form.vehicleNumber,
        brand: form.brand,
        model: form.model,
        year: form.year,
        type: form.type,
      };

      const res = await axios.post(REGISTER_API, payload);

      alert(res.data.message);

      // refresh list after adding
      fetchCustomers();

      // reset form
      setForm({
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
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to add customer");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Add New Customer</h1>
        <p className="text-sm text-gray-500">
          Register customer with vehicle details
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-3 rounded"
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-3 rounded"
              required
            />
          </div>

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-3 rounded"
            required
          />

          {/* PHONE + ADDRESS */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-3 rounded"
              required
            />
          </div>

          {/* VEHICLE */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number"
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="border p-3 rounded"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Model"
              className="border p-3 rounded"
              required
            />

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
              className="border p-3 rounded"
              required
            />

            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Type (Car/Bike)"
              className="border p-3 rounded"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            Save Customer
          </button>
        </form>
      </div>

      {/* CUSTOMER LIST */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="font-semibold mb-4">Recent Customers</h2>

        {customers.length === 0 ? (
          <p className="text-gray-500">No customers found</p>
        ) : (
          <div className="space-y-3">
            {customers.map((c) => (
              <div
                key={c.id}
                className="border p-4 rounded flex justify-between"
              >
                <div>
                  <p className="font-medium">{c.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {c.phone} • {c.address}
                  </p>
                </div>

                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomer;