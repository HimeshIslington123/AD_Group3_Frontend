import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Pencil,
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Boxes,
  Warehouse,
  TrendingDown,
  ChevronDown,
  ArrowUpDown,
  Tag,
  FileText,
  CircleDollarSign,
  Layers,
  Truck,
  Filter,
  BarChart3,
} from "lucide-react";

const API_URL = "http://localhost:5216/api/parts";
const VENDOR_API = "http://localhost:5216/api/vendor";

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-4
                     rounded-2xl shadow-2xl text-sm font-semibold animate-slide-in
                     ${type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
      {type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
      {msg}
    </div>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
const ConfirmDialog = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[55] p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-modal-in">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <Trash2 size={20} className="text-rose-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Delete Part</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Remove <span className="font-semibold text-slate-700">"{name}"</span>? This cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition">Yes, Delete</button>
      </div>
    </div>
  </div>
);

// ─── Stock Badge ──────────────────────────────────────────────────────────────
const StockBadge = ({ qty }) => {
  if (qty === 0)
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-500">Out of Stock</span>;
  if (qty < 10)
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-700"><TrendingDown size={10} />{qty} — Critical</span>;
  if (qty < 20)
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-700"><AlertTriangle size={10} />{qty} — Low</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-700">{qty} — Good</span>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${accent.bg}`}>
      <Icon size={22} className={accent.text} strokeWidth={1.8} />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-2xl font-black text-slate-800 mt-0.5 leading-tight">{value}</p>
    </div>
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children, span }) => (
  <div className={`space-y-1.5 ${span ? "md:col-span-2" : ""}`}>
    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
      <Icon size={11} className="text-slate-400" />{label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 transition-all";

// ─── Main ─────────────────────────────────────────────────────────────────────
const InventoryManagement = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stockQuantity: "", vendorId: "",
  });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchParts = async () => {
    try {
      setFetching(true);
      const r = await axios.get(API_URL, { headers });
      setItems(r.data);
    } catch (e) { console.error(e); }
    finally { setFetching(false); }
  };

  const fetchVendors = async () => {
    try {
      const r = await axios.get(VENDOR_API, { headers });
      setVendors(r.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchParts(); fetchVendors(); }, []);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = items
    .filter((i) => {
      const q = search.toLowerCase();
      const matchSearch = i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q);
      const matchStock =
        stockFilter === "all" ? true :
        stockFilter === "low" ? i.stockQuantity < 10 :
        stockFilter === "critical" ? i.stockQuantity === 0 :
        i.stockQuantity >= 20;
      return matchSearch && matchStock;
    })
    .sort((a, b) =>
      sort === "newest" ? b.id - a.id :
      sort === "oldest" ? a.id - b.id :
      sort === "price-asc" ? a.price - b.price :
      sort === "price-desc" ? b.price - a.price :
      sort === "stock-asc" ? a.stockQuantity - b.stockQuantity :
      b.stockQuantity - a.stockQuantity
    );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const openAdd = () => {
    setIsEdit(false); setEditId(null);
    setFormData({ name: "", description: "", price: "", stockQuantity: "", vendorId: "" });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setIsEdit(true); setEditId(item.id);
    setFormData({
      name: item.name, description: item.description,
      price: item.price, stockQuantity: item.stockQuantity,
      vendorId: item.vendorId,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      name: formData.name, description: formData.description,
      price: Number(formData.price), stockQuantity: Number(formData.stockQuantity),
      vendorId: Number(formData.vendorId),
    };
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${editId}`, { id: editId, ...payload }, { headers });
        showToast("Part updated successfully");
      } else {
        await axios.post(API_URL, payload, { headers });
        showToast("Part added successfully");
      }
      setShowModal(false);
      fetchParts();
    } catch (err) {
      console.error(err);
      showToast(isEdit ? "Failed to update part" : "Failed to add part", "error");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await axios.delete(`${API_URL}/${confirm.id}`, { headers });
      showToast("Part deleted");
      fetchParts();
    } catch { showToast("Delete failed", "error"); }
    finally { setConfirm(null); }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalValue = items.reduce((s, i) => s + i.price * i.stockQuantity, 0);
  const lowStockCount = items.filter((i) => i.stockQuantity < 10).length;
  const inStockCount = items.filter((i) => i.stockQuantity > 0).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slide-in { from{opacity:0;transform:translateX(2rem)} to{opacity:1;transform:translateX(0)} }
        .animate-slide-in { animation:slide-in .25s ease; }
        @keyframes modal-in { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .animate-modal-in { animation:modal-in .2s ease; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog name={confirm.name} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />}

      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Warehouse size={15} className="text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Inventory</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">Inventory Management</h1>
              <p className="text-slate-400 text-sm mt-1">Real-time tracking of vehicle components</p>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white
                         text-sm font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-200
                         active:scale-95 transition-all"
            >
              <Plus size={16} /> Add New Part
            </button>
          </div>

          {/* ── Stat Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Boxes} label="Total Parts" value={items.length}
              accent={{ bg: "bg-indigo-50", text: "text-indigo-600" }} />
            <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={lowStockCount}
              accent={{ bg: "bg-amber-50", text: "text-amber-600" }} />
            <StatCard icon={BarChart3} label="Inventory Value"
              value={`Rs ${totalValue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`}
              accent={{ bg: "bg-emerald-50", text: "text-emerald-600" }} />
            <StatCard icon={Package} label="In-Stock Items" value={inStockCount}
              accent={{ bg: "bg-blue-50", text: "text-blue-600" }} />
          </div>

          {/* ── Filter Bar ─────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl px-5 py-4
                          flex flex-col md:flex-row gap-3 md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search parts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200
                           rounded-xl outline-none focus:border-indigo-400 focus:ring-2
                           focus:ring-indigo-100 transition placeholder:text-slate-300"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={14} className="text-slate-400 hidden md:block" />

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="pl-8 pr-8 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200
                             rounded-xl outline-none focus:border-indigo-400 appearance-none cursor-pointer">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="stock-asc">Stock: Low → High</option>
                  <option value="stock-desc">Stock: High → Low</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Stock filter */}
              <div className="relative">
                <Layers size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
                  className="pl-8 pr-8 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200
                             rounded-xl outline-none focus:border-indigo-400 appearance-none cursor-pointer">
                  <option value="all">All Stock</option>
                  <option value="critical">Out of Stock</option>
                  <option value="low">Critical (&lt;10)</option>
                  <option value="high">Good (≥20)</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Result count */}
              {search || stockFilter !== "all" ? (
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              ) : null}
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {fetching ? (
              <div className="flex items-center justify-center py-28 gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading inventory…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 gap-3 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Package size={28} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {search || stockFilter !== "all" ? "No parts match your filters" : "No parts added yet"}
                </p>
                <p className="text-xs text-slate-400">
             
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Part", "Description", "Price", "Stock", "Vendor", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">

                        {/* Part */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                              <Package size={15} className="text-indigo-500" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-400">ID #{item.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-5 py-4 text-slate-500 max-w-xs truncate">
                          {item.description || <span className="text-slate-300">—</span>}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-800">
                            Rs {Number(item.price).toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4">
                          <StockBadge qty={item.stockQuantity} />
                        </td>

                        {/* Vendor */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl
                                           text-xs font-semibold bg-slate-100 text-slate-600">
                            <Truck size={11} />
                            {vendors.find((v) => v.id === item.vendorId)?.name || "N/A"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-600
                                         bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => setConfirm({ id: item.id, name: item.name })}
                              className="flex items-center gap-1.5 text-xs font-bold text-rose-500
                                         bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {!fetching && filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between text-xs text-slate-400">
                <span>Showing {filtered.length} of {items.length} parts</span>
                <span>
                  Total value shown: Rs {filtered.reduce((s, i) => s + i.price * i.stockQuantity, 0)
                    .toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-modal-in">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center
                                 ${isEdit ? "bg-amber-100" : "bg-indigo-100"}`}>
                  {isEdit
                    ? <Pencil size={17} className="text-amber-600" />
                    : <Plus size={17} className="text-indigo-600" />}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    {isEdit ? "Edit Part" : "Add New Part"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEdit ? "Update part details below" : "Fill in the details to add a new part"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Field label="Part Name" icon={Tag}>
                  <input name="name" placeholder="e.g. Brake Pad" value={formData.name}
                    onChange={handleChange} required className={inputCls} />
                </Field>

                <Field label="Description" icon={FileText}>
                  <input name="description" placeholder="Short description" value={formData.description}
                    onChange={handleChange} required className={inputCls} />
                </Field>

                <Field label="Price (Rs)" icon={CircleDollarSign}>
                  <input type="number" name="price" placeholder="0.00" min="0" value={formData.price}
                    onChange={handleChange} required className={inputCls} />
                </Field>

                <Field label="Initial Stock" icon={Boxes}>
                  <input type="number" name="stockQuantity" placeholder="0" min="0" value={formData.stockQuantity}
                    onChange={handleChange} required className={inputCls} />
                </Field>

                <Field label="Vendor" icon={Truck} span>
                  <div className="relative">
                    <Truck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select name="vendorId" value={formData.vendorId} onChange={handleChange} required
                      className={`${inputCls} pl-10 pr-10 appearance-none`}>
                      <option value="">Select vendor…</option>
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </Field>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-5 mt-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                              shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all
                              ${isEdit ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`}>
                  {submitting
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                    : <><Save size={15} />{isEdit ? "Update Part" : "Add Part"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryManagement;