import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  Mail,
  Lock,
  Briefcase,
  UserCircle2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const STAFF_API = "http://localhost:5216/api/staff";
const REGISTER_API = "http://localhost:5216/api/auth/register";
const UPDATE_API = "http://localhost:5216/api/staff";

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-4
                  rounded-2xl shadow-2xl text-sm font-semibold animate-slide-in
                  ${type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}
    >
      {type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
      {msg}
    </div>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
const ConfirmDialog = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[55] p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
          <Trash2 size={20} className="text-rose-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Delete Staff Member</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Remove <span className="font-semibold text-slate-700">{name}</span>? This cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600
                     bg-slate-100 hover:bg-slate-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white
                     bg-rose-600 hover:bg-rose-700 transition"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = "md" }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  const sz = size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-xs";

  return (
    <div className={`${sz} ${color} rounded-2xl flex items-center justify-center font-black flex-shrink-0`}>
      {initials}
    </div>
  );
};

// ─── Form Field ───────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
      <Icon size={12} className="text-slate-400" />
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ type = "text", name, placeholder, value, onChange, required }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full border border-slate-200 bg-slate-50 focus:bg-white
               focus:border-blue-400 focus:ring-2 focus:ring-blue-100
               outline-none rounded-xl px-4 py-2.5 text-sm text-slate-700
               placeholder:text-slate-300 transition-all"
  />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("fullName");
  const [sortAsc, setSortAsc] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", position: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null); // { id, name }
  const [openMenu, setOpenMenu] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchStaff = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(STAFF_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ── Search + sort ─────────────────────────────────────────────────────────
  useEffect(() => {
    let list = [...staff];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.position?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const av = (a[sortField] || "").toLowerCase();
      const bv = (b[sortField] || "").toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    setFiltered(list);
  }, [staff, search, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc((p) => !p);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }) =>
    sortField === field
      ? sortAsc
        ? <ChevronUp size={12} className="text-blue-500" />
        : <ChevronDown size={12} className="text-blue-500" />
      : <ChevronDown size={12} className="text-slate-300" />;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setForm({ fullName: "", email: "", password: "", position: "" });
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setForm({ fullName: s.fullName, email: s.email, password: "", position: s.position });
    setEditId(s.id);
    setIsEdit(true);
    setIsModalOpen(true);
    setOpenMenu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (isEdit) {
        await axios.put(
          `${UPDATE_API}/${editId}`,
          { id: editId, fullName: form.fullName, email: form.email, position: form.position },
          { headers }
        );
        showToast("Staff updated successfully");
      } else {
        await axios.post(
          REGISTER_API,
          {
            fullName: form.fullName, email: form.email,
            password: form.password, role: "Staff",
            position: form.position,
            phone: "", address: "", vehicleNumber: "",
            brand: "", model: "", year: 0, type: "",
          },
          { headers }
        );
        showToast("Staff member added successfully");
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      showToast(err.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${STAFF_API}/${confirm.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Staff member removed");
      fetchStaff();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setConfirm(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slide-in {
          from { opacity:0; transform:translateX(2rem); }
          to   { opacity:1; transform:translateX(0); }
        }
        .animate-slide-in { animation: slide-in .25s ease; }
        @keyframes modal-in {
          from { opacity:0; transform:scale(.96) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in .2s ease; }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          name={confirm.name}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="min-h-screen bg-slate-50 p-6 md:p-10" onClick={() => setOpenMenu(null)}>
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={15} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                  Human Resources
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">Staff Management</h1>
              <p className="text-slate-400 text-sm mt-1">
                {staff.length} total member{staff.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg
                         shadow-blue-200 active:scale-95 transition-all duration-150"
            >
              <UserPlus size={16} />
              Add Staff
            </button>
          </div>

          {/* ── Search + stats bar ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or position…"
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200
                           rounded-xl outline-none focus:border-blue-400 focus:ring-2
                           focus:ring-blue-100 transition text-slate-700 placeholder:text-slate-300"
              />
            </div>

            {/* stat pills */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs shadow-sm">
                <Users size={13} className="text-blue-500" />
                <span className="text-slate-500">Total:</span>
                <span className="font-black text-slate-700">{staff.length}</span>
              </div>
              {search && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs">
                  <Search size={13} className="text-blue-500" />
                  <span className="font-bold text-blue-700">{filtered.length} results</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Table Card ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {fetching ? (
              <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading staff…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Users size={28} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {search ? "No results found" : "No staff members yet"}
                </p>
                <p className="text-xs text-slate-400">
                  {search ? "Try a different search term" : 'Click "Add Staff" to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        { label: "Name", field: "fullName" },
                        { label: "Email", field: "email" },
                        { label: "Position", field: "position" },
                      ].map(({ label, field }) => (
                        <th
                          key={field}
                          onClick={() => toggleSort(field)}
                          className="px-5 py-3.5 text-left cursor-pointer select-none group"
                        >
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition">
                            {label}
                            <SortIcon field={field} />
                          </span>
                        </th>
                      ))}
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/60 transition-colors duration-100 group"
                      >
                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={s.fullName || "?"} />
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-tight">
                                {s.fullName}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">ID #{s.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Mail size={13} className="text-slate-300 flex-shrink-0" />
                            {s.email}
                          </div>
                        </td>

                        {/* Position */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl
                                           text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            <Briefcase size={11} />
                            {s.position || "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => openEdit(s)}
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-600
                                         hover:text-blue-800 bg-blue-50 hover:bg-blue-100
                                         px-3 py-1.5 rounded-xl transition-colors"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirm({ id: s.id, name: s.fullName })}
                              className="flex items-center gap-1.5 text-xs font-bold text-rose-500
                                         hover:text-rose-700 bg-rose-50 hover:bg-rose-100
                                         px-3 py-1.5 rounded-xl transition-colors"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer count */}
            {!fetching && filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 flex justify-between">
                <span>Showing {filtered.length} of {staff.length} staff members</span>
                <span>Sorted by {sortField} {sortAsc ? "↑" : "↓"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center
                                 ${isEdit ? "bg-amber-100" : "bg-blue-100"}`}>
                  {isEdit
                    ? <Pencil size={17} className="text-amber-600" />
                    : <UserPlus size={17} className="text-blue-600" />
                  }
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    {isEdit ? "Edit Staff Member" : "Add New Staff"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEdit ? "Update details below" : "Fill in the details to create account"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl
                           bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <Field label="Full Name" icon={UserCircle2}>
                <Input
                  name="fullName"
                  placeholder="e.g. Ramesh Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Email Address" icon={Mail}>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. ramesh@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              {!isEdit && (
                <Field label="Password" icon={Lock}>
                  <Input
                    type="password"
                    name="password"
                    placeholder="e.g. Test@123"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Field>
              )}

              <Field label="Position / Role" icon={Briefcase}>
                <Input
                  name="position"
                  placeholder="e.g. Mechanic, Cashier, Manager"
                  value={form.position}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500
                             hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                              text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                              active:scale-95 transition-all duration-150
                              ${isEdit
                                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      {isEdit ? "Update Staff" : "Create Staff"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffManagement;