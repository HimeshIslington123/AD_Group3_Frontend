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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Vendor Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage supplier details and partnerships</p>
                </div>
                <button
                    onClick={() => {
                        setIsEdit(false);
                        setForm({ name: "", email: "", phone: "", address: "" });
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                    + Add Vendor
                </button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-500">
                        <tr>
                            <th className="p-4">Vendor Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Address</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vendors.map((v) => (
                            <tr key={v.id} className="border-t hover:bg-slate-50">
                                <td className="p-4 font-medium">{v.name}</td>
                                <td className="p-4">{v.email}</td>
                                <td className="p-4">{v.phone}</td>
                                <td className="p-4">{v.address}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEdit(v)} className="text-blue-600 mr-3 font-medium">Edit</button>
                                    <button onClick={() => handleDelete(v.id)} className="text-red-600 font-medium">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Vendor" : "Add New Vendor"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Vendor Name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />
                            <input
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />
                            <input
                                name="address"
                                placeholder="Address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
                                    {loading ? "Processing..." : "Save Vendor"}
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