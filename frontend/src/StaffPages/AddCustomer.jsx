import React, { useState } from "react";

const AddCustomer = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    vehicleNumber: "",
    vehicleModel: "",
  });

  const [customers, setCustomers] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCustomer = {
      id: Date.now(),
      ...form,
    };

    setCustomers([newCustomer, ...customers]);

    setForm({
      name: "",
      phone: "",
      address: "",
      vehicleNumber: "",
      vehicleModel: "",
    });

    alert("Customer added successfully!");
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Add New Customer
        </h1>
        <p className="text-sm text-slate-500">
          Register customer with vehicle details
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME + PHONE */}
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

          </div>

          {/* ADDRESS */}
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* VEHICLE NUMBER + MODEL */}
          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number (e.g. BA 2 PA 1234)"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="vehicleModel"
              value={form.vehicleModel}
              onChange={handleChange}
              placeholder="Vehicle Model (e.g. Toyota Corolla)"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Save Customer
          </button>

        </form>

      </div>

      {/* CUSTOMER LIST */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <h2 className="font-semibold mb-4">Recent Customers</h2>

        {customers.length === 0 ? (
          <p className="text-sm text-slate-500">
            No customers added yet
          </p>
        ) : (
          <div className="space-y-3">

            {customers.map((c) => (
              <div
                key={c.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >

                <div>
                  <p className="font-medium text-slate-800">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {c.phone} • {c.address}
                  </p>
                  <p className="text-xs text-slate-500">
                    🚗 {c.vehicleModel} ({c.vehicleNumber})
                  </p>
                </div>

                <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full">
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