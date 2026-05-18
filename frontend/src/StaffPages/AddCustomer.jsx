import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:51391/api";
const CUSTOMER_API = `${BASE_URL}/customer`;
const REGISTER_API = `${BASE_URL}/auth/register`;

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
  const [loading, setLoading] = useState(false);

  // Get token for auth
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(CUSTOMER_API, getHeaders());
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
    setLoading(true);

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

      const res = await axios.post(REGISTER_API, payload, getHeaders());

      alert(res.data.message || "Customer added successfully");

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
      alert(err.response?.data?.error || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Customer Registration</h1>
        <p className="text-slate-500 font-medium">
          Onboard new customers and link their vehicle information
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
              Customer Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* NAME + EMAIL */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Initial Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Set a secure password"
                  className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* PHONE + ADDRESS */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Home Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="City, Area, Street"
                    className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">2</span>
                  Vehicle Information
                </h2>
                
                {/* VEHICLE NO + BRAND */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Vehicle License No.</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={form.vehicleNumber}
                      onChange={handleChange}
                      placeholder="BA 1 PA 1234"
                      className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Vehicle Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="e.g. Toyota, Honda"
                      className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mt-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      placeholder="e.g. Corolla"
                      className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      placeholder="2024"
                      className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Body Type</label>
                    <input
                      type="text"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      placeholder="Sedan/SUV"
                      className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 mt-8"
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full max-h-[800px]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
              Recent Regulars
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-500 uppercase tracking-widest">{customers.length} total</span>
            </h2>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {customers.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl">🏜️</div>
                  <p className="text-slate-400 font-medium">No customers registered yet</p>
                </div>
              ) : (
                customers.map((c) => (
                  <div
                    key={c.id}
                    className="group border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 p-4 rounded-2xl transition-all cursor-default"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">{c.fullName}</p>
                        <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
                           {c.phone}
                        </p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                           {c.address}
                        </p>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-600 uppercase">
                           {c.vehicleNumber || "N/A"}
                        </span>
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-600 uppercase">
                           {c.brand} {c.model}
                        </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;