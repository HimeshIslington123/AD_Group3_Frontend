import React, { useState } from "react";
import axios from "axios";

const REGISTER_API = "http://localhost:5216/api/auth/register";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "Customer",
  phone: "",
  address: "",
  vehicleNumber: "",
  brand: "",
  model: "",
  year: "",
  type: "",
};

const Register = () => {
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        year: Number(form.year),
      };

      const res = await axios.post(REGISTER_API, payload);

      setSuccess(res.data?.message || "Registration Successful!");

      setForm(emptyForm);
    } catch (err) {
      console.log(err.response?.data);

      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Registration failed";

      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
  backgroundImage: "url('/carss.jpeg')"
}} className="min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-1">
          Customer Registration
        </h1>

        <p className="text-gray-500 mb-6">
          Create your account and add vehicle details
        </p>

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* USER INFO */}
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded"
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded"
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
            className="border p-2 rounded w-full"
            required
          />

          {/* CONTACT */}
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded"
              required
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded"
              required
            />
          </div>

          {/* VEHICLE */}
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number"
              className="border p-2 rounded"
            />

            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Vehicle Type"
              className="border p-2 rounded"
            />
          </div>

          {/* BRAND MODEL YEAR */}
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="border p-2 rounded"
            />

            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Model"
              className="border p-2 rounded"
            />

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
              className="border p-2 rounded"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;