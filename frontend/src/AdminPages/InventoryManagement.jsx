import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:51391/api";
const PART_API = `${BASE_URL}/part`;
const VENDOR_API = `${BASE_URL}/vendor`;

const InventoryManagement = () => {
  const [parts, setParts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    vendorId: "",
  });

  const [purchaseModal, setPurchaseModal] = useState({
    isOpen: false,
    partId: null,
    quantity: 0
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [partsRes, vendorsRes] = await Promise.all([
        axios.get(PART_API, getHeaders()),
        axios.get(VENDOR_API, getHeaders())
      ]);
      setParts(partsRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data. Make sure you are logged in as Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'stockQuantity' || name === 'vendorId' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`${PART_API}/${editId}`, { ...form, id: editId }, getHeaders());
        alert("Part updated successfully");
      } else {
        await axios.post(PART_API, form, getHeaders());
        alert("Part created successfully");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this part?")) return;
    try {
      await axios.delete(`${PART_API}/${id}`, getHeaders());
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${PART_API}/${purchaseModal.partId}/purchase`, purchaseModal.quantity, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      alert("Stock updated successfully");
      setPurchaseModal({ isOpen: false, partId: null, quantity: 0 });
      fetchData();
    } catch (err) {
        console.error(err);
      alert("Purchase failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-slate-500">Manage vehicle parts and stock levels</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setForm({ name: "", description: "", price: 0, stockQuantity: 0, vendorId: vendors[0]?.id || "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Part
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Part Name</th>
              <th className="p-4 font-semibold text-slate-700">Vendor</th>
              <th className="p-4 font-semibold text-slate-700">Price</th>
              <th className="p-4 font-semibold text-slate-700">Stock</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parts.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-slate-500">No parts found.</td></tr>
            ) : (
              parts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{p.name}</td>
                  <td className="p-4 text-slate-600">{p.vendor?.name || "N/A"}</td>
                  <td className="p-4 text-slate-600">${p.price}</td>
                  <td className={`p-4 font-bold ${p.stockQuantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {p.stockQuantity}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                        onClick={() => setPurchaseModal({ isOpen: true, partId: p.id, quantity: 10 })}
                        className="text-amber-600 hover:text-amber-800 font-medium"
                    >
                        Purchase
                    </button>
                    <button 
                        onClick={() => {
                            setIsEdit(true);
                            setEditId(p.id);
                            setForm({
                                name: p.name,
                                description: p.description,
                                price: p.price,
                                stockQuantity: p.stockQuantity,
                                vendorId: p.vendorId
                            });
                            setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{isEdit ? "Edit Part" : "Add New Part"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2.5" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} className="w-full border rounded-lg p-2.5" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Vendor</label>
                <select name="vendorId" value={form.vendorId} onChange={handleChange} className="w-full border rounded-lg p-2.5" required>
                  <option value="">Select Vendor</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  {loading ? "Saving..." : "Save Part"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {purchaseModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Purchase Stock</h2>
            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity to Add</label>
                <input 
                    type="number" 
                    value={purchaseModal.quantity} 
                    onChange={(e) => setPurchaseModal({...purchaseModal, quantity: Number(e.target.value)})} 
                    className="w-full border rounded-lg p-2.5" 
                    min="1"
                    required 
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setPurchaseModal({isOpen: false})} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium">Confirm Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;