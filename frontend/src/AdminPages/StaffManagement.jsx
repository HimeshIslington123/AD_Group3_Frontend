import React, { useEffect, useState } from "react";
import axios from "axios";

const STAFF_API = "http://localhost:5216/api/staff";
const REGISTER_API = "http://localhost:5216/api/auth/register";
const UPDATE_API = "http://localhost:5216/api/staff";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);

  // FETCH STAFF
  const fetchStaff = async () => {
    try {
      const res = await axios.get(STAFF_API);
      setStaff(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // OPEN EDIT
  const handleEdit = (s) => {
    setForm({
      fullName: s.fullName,
      email: s.email,
      password: "",
      position: s.position,
    });
    setEditId(s.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        // UPDATE
        await axios.put(`${UPDATE_API}/${editId}`, {
          id: editId,
          fullName: form.fullName,
          email: form.email,
          position: form.position,
        });
        alert("Staff updated successfully");
      } else {
        // CREATE
        await axios.post(REGISTER_API, {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: "Staff",
          position: form.position,
          // fallback fields
          phone: "",
          address: "",
          vehicleNumber: "",
          brand: "",
          model: "",
          year: 0,
          type: "",
        });
        alert("Staff created successfully");
      }

      // RESET
      setForm({ fullName: "", email: "", password: "", position: "" });
      setIsEdit(false);
      setEditId(null);
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      console.error(err.response);
      alert(
        err.response?.data?.error ||
          JSON.stringify(err.response?.data) ||
          "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff?")) return;
    try {
      await axios.delete(`${STAFF_API}/${id}`);
      fetchStaff();
    } catch {
      alert("Delete failed");
    }
  };

 



  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className=" mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>

          <button
            onClick={() => {
              setIsEdit(false);
              setForm({ fullName: "", email: "", password: "", position: "" });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 shadow-sm"
          >
            + Add Staff
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Position</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-14 text-slate-400 text-sm">
                    No staff members yet. Click "+ Add Staff" to get started.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors duration-100">
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                       
                        <span className="font-medium text-slate-800">{s.fullName}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-slate-500 text-sm">{s.email}</td>

                    {/* Position */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                        {s.position || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {isEdit ? "Edit Staff" : "Add Staff"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 transition-all"
                  required
                />
              </div>

              {!isEdit && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password (e.g. Test@123)"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 transition-all"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Position</label>
                <input
                  name="position"
                  placeholder="Position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 transition-all"
                  required
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                  {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;