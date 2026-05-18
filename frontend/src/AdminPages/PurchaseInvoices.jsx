import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:51391/api";
const INVOICE_API = `${BASE_URL}/PurchaseInvoice`;
const VENDOR_API = `${BASE_URL}/Vendor`;
const PART_API = `${BASE_URL}/Part`;

const PurchaseInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [parts, setParts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        vendorId: "",
        items: [{ partId: "", quantity: 1, unitPrice: 0 }]
    });

    const getHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invRes, venRes, partRes] = await Promise.all([
                axios.get(INVOICE_API, getHeaders()),
                axios.get(VENDOR_API, getHeaders()),
                axios.get(PART_API, getHeaders())
            ]);
            setInvoices(invRes.data);
            setVendors(venRes.data);
            setParts(partRes.data);
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddItem = () => {
        setForm({ ...form, items: [...form.items, { partId: "", quantity: 1, unitPrice: 0 }] });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...form.items];
        newItems[index][field] = field === 'partId' ? Number(value) : Number(value);
        setForm({ ...form, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(INVOICE_API, form, getHeaders());
            alert("Invoice created and stock updated");
            setIsModalOpen(false);
            setForm({ vendorId: "", items: [{ partId: "", quantity: 1, unitPrice: 0 }] });
            fetchData();
        } catch (err) {
            alert("Failed to create invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Purchase Invoices</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage stock updates through purchase invoices</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                    + Create Invoice
                </button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-500">
                        <tr>
                            <th className="p-4">Invoice ID</th>
                            <th className="p-4">Vendor</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="border-t hover:bg-slate-50">
                                <td className="p-4 font-medium">#{inv.id}</td>
                                <td className="p-4">{inv.vendorName}</td>
                                <td className="p-4">{new Date(inv.date).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-blue-600">${inv.totalAmount?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto pt-20 pb-20">
                    <div className="bg-white w-[600px] rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">New Purchase Invoice</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Vendor</label>
                                <select 
                                    value={form.vendorId} 
                                    onChange={(e) => setForm({...form, vendorId: Number(e.target.value)})}
                                    className="w-full border p-3 rounded-lg" 
                                    required
                                >
                                    <option value="">Select Vendor</option>
                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Invoice Items</label>
                                {form.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-3 border p-3 rounded-lg bg-slate-50">
                                        <select 
                                            value={item.partId} 
                                            onChange={(e) => handleItemChange(index, "partId", e.target.value)}
                                            className="border p-2 rounded col-span-1"
                                            required
                                        >
                                            <option value="">Select Part</option>
                                            {parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <input 
                                            type="number" 
                                            placeholder="Qty" 
                                            value={item.quantity} 
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                            className="border p-2 rounded" 
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Unit Price" 
                                            value={item.unitPrice} 
                                            onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                            className="border p-2 rounded" 
                                            required 
                                        />
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={handleAddItem}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    + Add Another Item
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
                                    {loading ? "Processing..." : "Create Invoice"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseInvoices;
