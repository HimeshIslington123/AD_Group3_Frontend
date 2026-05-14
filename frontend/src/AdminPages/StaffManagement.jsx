import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:51391/api";
const STAFF_API = `${BASE_URL}/staff`;
const REGISTER_API = `${BASE_URL}/auth/register`;

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

  // Get token for auth
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // FETCH STAFF
  const fetchStaff = async () => {
    try {
      const res = await axios.get(STAFF_API, getHeaders());
      setStaff(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized. Please login as Admin.");
      }
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
        await axios.put(`${STAFF_API}/${editId}`, {
          id: editId,
          fullName: form.fullName,
          email: form.email,
          position: form.position,
          userId: staff.find(s => s.id === editId)?.userId // Keep existing userId
        }, getHeaders());
        alert("Staff updated successfully");
      } else {
        // CREATE via Auth Register (which handles User + Staff creation)
        await axios.post(REGISTER_API, {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: "Staff",
          position: form.position
        }, getHeaders());
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
          err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await axios.delete(`${STAFF_API}/${id}`, getHeaders());
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Delete failed. " + (err.response?.data?.message || ""));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-slate-500">Manage your system staff and their roles</p>
        </div>
        <button
          onClick={() => {
            setIsEdit(false);
            setForm({ fullName: "", email: "", password: "", position: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Full Name</th>
              <th className="p-4 font-semibold text-slate-700">Email</th>
              <th className="p-4 font-semibold text-slate-700">Position</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-500">
                  No staff members found.
                </td>
              </tr>
            ) : (
              staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{s.fullName}</td>
                  <td className="p-4 text-slate-600">{s.email}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {s.position}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {isEdit ? "Edit Staff Member" : "Add New Staff"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="staff@example.com"
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  required
                  disabled={isEdit}
                />
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Position</label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. Sales Manager"
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : isEdit ? "Update Staff" : "Add Staff"}
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