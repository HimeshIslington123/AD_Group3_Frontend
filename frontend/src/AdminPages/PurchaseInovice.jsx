import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Truck,
  Plus,
  Trash2,
  Save,
  ShoppingCart,
  Package,
  ChevronDown,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Hash,
  Tag,
  Layers,
} from "lucide-react";

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
                  text-sm font-semibold animate-slide-in
                  ${type === "success"
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 text-white"}`}
    >
      {type === "success" ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      {msg}
    </div>
  );
};

// ─── Custom Select ────────────────────────────────────────────────────────────
const SelectField = ({ value, onChange, options, placeholder, icon: Icon }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon size={15} className="text-slate-400" />
      </div>
    )}
    <select
      value={value}
      onChange={onChange}
      className={`w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl
                  py-3 pr-10 text-sm text-slate-700 outline-none
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition
                  ${Icon ? "pl-10" : "pl-4"}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={15}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
  </div>
);

// ─── Number Input ─────────────────────────────────────────────────────────────
const NumberInput = ({ value, onChange, min, readOnly, prefix }) => (
  <div className="relative">
    {prefix && (
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
        {prefix}
      </span>
    )}
    <input
      type="number"
      min={min}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full border rounded-xl py-3 text-sm text-slate-700 outline-none transition
                  ${prefix ? "pl-9" : "pl-4"} pr-4
                  ${readOnly
                    ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PurchaseInvoice = () => {
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [items, setItems] = useState([{ partId: "", quantity: 1, unitPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get("http://localhost:5216/api/vendor", { headers })
      .then((r) => setVendors(r.data))
      .catch(console.error);

    axios.get("http://localhost:5216/api/parts", { headers })
      .then((r) => setParts(r.data))
      .catch(console.error);
  }, []);

  // ── Row handlers ──────────────────────────────────────────────────────────
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "partId") {
      const part = parts.find((p) => p.id == value);
      if (part) updated[index].unitPrice = part.price;
    }

    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { partId: "", quantity: 1, unitPrice: 0 }]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  // ── Derived ───────────────────────────────────────────────────────────────
  const total = items.reduce(
    (s, i) => s + Number(i.quantity || 0) * Number(i.unitPrice || 0),
    0
  );

  const invoiceNo = `PO-${Date.now().toString().slice(-6)}`;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) return showToast("Please select a vendor", "error");

    const invalid = items.some((i) => !i.partId || i.quantity <= 0);
    if (invalid) return showToast("Fill all product fields correctly", "error");

    setSubmitting(true);

    const payload = {
      vendorId: Number(vendorId),
      items: items.map((i) => ({
        partId: Number(i.partId),
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
    };

    try {
      await axios.post("http://localhost:5216/api/PurchaseInvoice", payload);
      showToast("Purchase invoice created successfully!");
      setVendorId("");
      setItems([{ partId: "", quantity: 1, unitPrice: 0 }]);
    } catch (err) {
      console.error(err.response?.data);
      showToast("Failed to create invoice", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const vendorOptions = vendors.map((v) => ({ value: v.id, label: v.name }));
  const partOptions = parts.map((p) => ({ value: p.id, label: p.name }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(2rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in .25s ease; }
      `}</style>

      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Receipt size={16} className="text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                  Procurement
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">
                Purchase Invoice
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Create a new purchase order from a vendor
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
              <Hash size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 tracking-widest">
                {invoiceNo}
              </span>
            </div>
          </div>

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Vendor Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck size={15} className="text-blue-500" />
                Vendor Details
              </h2>

              <div className="max-w-sm">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Select Vendor <span className="text-rose-400">*</span>
                </label>
                <SelectField
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  options={vendorOptions}
                  placeholder="Choose a vendor…"
                  icon={Truck}
                />
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Package size={15} className="text-indigo-500" />
                  Order Items
                </h2>
                <span className="text-xs text-slate-400">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Table — desktop */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3 text-left font-semibold">#</th>
                      <th className="px-4 py-3 text-left font-semibold">Product</th>
                      <th className="px-4 py-3 text-left font-semibold w-28">Qty</th>
                      <th className="px-4 py-3 text-left font-semibold w-36">Unit Price</th>
                      <th className="px-4 py-3 text-left font-semibold w-36">Subtotal</th>
                      <th className="px-4 py-3 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map((item, index) => {
                      const subtotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
                      return (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Row # */}
                          <td className="px-4 py-3">
                            <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                              {index + 1}
                            </span>
                          </td>

                          {/* Product */}
                          <td className="px-4 py-3">
                            <SelectField
                              value={item.partId}
                              onChange={(e) =>
                                handleItemChange(index, "partId", e.target.value)
                              }
                              options={partOptions}
                              placeholder="Select product…"
                              icon={Tag}
                            />
                          </td>

                          {/* Qty */}
                          <td className="px-4 py-3">
                            <NumberInput
                              value={item.quantity}
                              min={1}
                              onChange={(e) =>
                                handleItemChange(index, "quantity", e.target.value)
                              }
                            />
                          </td>

                          {/* Unit price */}
                          <td className="px-4 py-3">
                            <NumberInput
                              value={item.unitPrice}
                              readOnly
                              prefix="Rs"
                            />
                          </td>

                          {/* Subtotal */}
                          <td className="px-4 py-3">
                            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-black text-slate-800 whitespace-nowrap">
                              Rs {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </div>
                          </td>

                          {/* Remove */}
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                              className="w-9 h-9 flex items-center justify-center rounded-xl
                                         bg-rose-50 text-rose-500 hover:bg-rose-100
                                         disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cards — mobile */}
              <div className="md:hidden space-y-4">
                {items.map((item, index) => {
                  const subtotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
                  return (
                    <div
                      key={index}
                      className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          Item #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100
                                     disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Product</label>
                        <SelectField
                          value={item.partId}
                          onChange={(e) => handleItemChange(index, "partId", e.target.value)}
                          options={partOptions}
                          placeholder="Select product…"
                          icon={Tag}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Qty</label>
                          <NumberInput
                            value={item.quantity}
                            min={1}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Unit Price</label>
                          <NumberInput value={item.unitPrice} readOnly prefix="Rs" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-500">Subtotal</span>
                        <span className="font-black text-slate-800 text-sm">
                          Rs {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Row Button */}
              <button
                type="button"
                onClick={addItem}
                className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed
                           border-blue-200 text-blue-600 text-sm font-semibold
                           hover:bg-blue-50 hover:border-blue-400 transition w-full justify-center"
              >
                <Plus size={16} />
                Add Another Product
              </button>
            </div>

            {/* Summary + Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                {/* Summary */}
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-emerald-50">
                    <ShoppingCart size={22} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Invoice Total
                    </p>
                    <p className="text-3xl font-black text-slate-900 mt-0.5">
                      Rs {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {items.length} {items.length === 1 ? "product" : "products"} ·{" "}
                      {items.reduce((s, i) => s + Number(i.quantity || 0), 0)} units
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVendorId("");
                      setItems([{ partId: "", quantity: 1, unitPrice: 0 }]);
                    }}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold
                               text-slate-600 hover:bg-slate-50 transition"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600
                               text-white text-sm font-bold shadow-lg shadow-blue-200
                               hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
                               transition-all duration-200"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Invoice
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Breakdown pills */}
              <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 text-xs">
                  <Layers size={12} className="text-slate-400" />
                  <span className="text-slate-500">Items:</span>
                  <span className="font-bold text-slate-700">{items.length}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 text-xs">
                  <Package size={12} className="text-slate-400" />
                  <span className="text-slate-500">Total units:</span>
                  <span className="font-bold text-slate-700">
                    {items.reduce((s, i) => s + Number(i.quantity || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-2 text-xs">
                  <Receipt size={12} className="text-emerald-500" />
                  <span className="text-emerald-600 font-semibold">
                    Rs {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default PurchaseInvoice;