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
            console.error("Fetch failed", err);
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
                await axios.put(`${VENDOR_API}/${editId}`, form, getHeaders());
                alert("Vendor updated successfully");
            } else {
                await axios.post(VENDOR_API, form, getHeaders());
                alert("Vendor added successfully");
            }
            setIsModalOpen(false);
            setForm({ name: "", email: "", phone: "", address: "" });
            setIsEdit(false);
            fetchVendors();
        } catch (err) {
            console.error(err);
            alert("Operation failed. Check if you have permission.");
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
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Vendor Management</h1>
                        <p className="text-slate-500 mt-1">Manage supplier details, contact info and partnerships</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsEdit(false);
                            setForm({ name: "", email: "", phone: "", address: "" });
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                        <span className="text-xl">+</span> Add Vendor
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Vendors</p>
                        <h2 className="text-3xl font-bold text-slate-800 mt-1">{vendors.length}</h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Partners</p>
                        <h2 className="text-3xl font-bold text-green-600 mt-1">{vendors.length}</h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Orders</p>
                        <h2 className="text-3xl font-bold text-blue-600 mt-1">0</h2>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                                    <th className="p-4 font-semibold text-slate-700">Vendor Name</th>
                                    <th className="p-4 font-semibold text-slate-700">Email Address</th>
                                    <th className="p-4 font-semibold text-slate-700">Phone</th>
                                    <th className="p-4 font-semibold text-slate-700">Address</th>
                                    <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {vendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-slate-500">
                                            No vendors found. Add one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    vendors.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-800">{v.name}</td>
                                            <td className="p-4 text-slate-600">{v.email}</td>
                                            <td className="p-4 text-slate-600">{v.phone}</td>
                                            <td className="p-4 text-slate-600">{v.address}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => handleEdit(v)} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Edit</button>
                                                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-800 font-semibold transition-colors">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {isEdit ? "Edit Vendor Details" : "Add New Vendor"}
                                </h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-2xl transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Vendor Name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Company Name"
                                        className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="vendor@example.com"
                                        className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Office Address</label>
                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Full address"
                                        className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-blue-500/20 shadow-lg active:scale-95"
                                    >
                                        {loading ? "Saving..." : isEdit ? "Update Vendor" : "Add Vendor"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorManagement;