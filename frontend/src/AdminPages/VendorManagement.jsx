import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:51391/api";
const VENDOR_API = `${BASE_URL}/vendor`;

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(VENDOR_API, getHeaders());
      setVendors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`${VENDOR_API}/${editId}`, { ...form, id: editId }, getHeaders());
        alert("Vendor updated successfully");
      } else {
        await axios.post(VENDOR_API, form, getHeaders());
        alert("Vendor added successfully");
      }
      setIsModalOpen(false);
      fetchVendors();
    } catch (err) {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (v) => {
    setForm({
      name: v.name,
      email: v.email,
      phone: v.phone,
      address: v.address,
    });
    setEditId(v.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await axios.delete(`${VENDOR_API}/${id}`, getHeaders());
      fetchVendors();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Vendor Management</h1>
          <p className="text-slate-500">Manage your suppliers and service partners</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setForm({ name: "", email: "", phone: "", address: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Vendors</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-1">{vendors.length}</h2>
        </div>
        {/* Placeholder for more stats if needed */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Vendor Name</th>
              <th className="p-4 font-semibold text-slate-700">Email</th>
              <th className="p-4 font-semibold text-slate-700">Phone</th>
              <th className="p-4 font-semibold text-slate-700">Address</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendors.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-slate-500">No vendors found.</td></tr>
            ) : (
              vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{v.name}</td>
                  <td className="p-4 text-slate-600">{v.email}</td>
                  <td className="p-4 text-slate-600">{v.phone}</td>
                  <td className="p-4 text-slate-600">{v.address}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(v)} className="text-blue-600 hover:text-blue-800 mr-4 font-medium">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{isEdit ? "Edit Vendor" : "Add New Vendor"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Acme Parts Corp" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contact@acme.com" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Office Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. 123 Industrial Way, NY" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" required />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  {loading ? "Saving..." : isEdit ? "Update Vendor" : "Save Vendor"}
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