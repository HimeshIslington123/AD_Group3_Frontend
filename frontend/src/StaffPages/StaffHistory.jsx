import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5216/api/appointment";

const StaffHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  // 🔥 FETCH ALL APPOINTMENTS
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setAppointments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔥 UPDATE STATUS
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API}/${id}/status`, JSON.stringify(newStatus), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // instant UI update
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update status");
    }
  };

  // 🔥 SEND INVOICE
  const handleSendInvoice = async (id) => {
    try {
      await axios.post(`${API}/${id}/send-invoice`);
      alert("Invoice sent successfully ✅");
    } catch (err) {
      console.error("Invoice error:", err);
      alert("Failed to send invoice ❌");
    }
  };

  // 🔥 FILTER
  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Staff Appointment Panel
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all customer appointments
          </p>
        </div>

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">SN</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th> {/* ✅ NEW */}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((a, i) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">

                  <td className="p-3">{i + 1}</td>

                  <td className="p-3 font-medium">
                    {a.customer?.fullName || "N/A"}
                  </td>

                  <td className="p-3 text-gray-600">
                    {a.vehicle
                      ? `${a.vehicle.brand} ${a.vehicle.model}`
                      : "N/A"}
                  </td>

                  <td className="p-3">{a.serviceType}</td>

                  <td className="p-3 text-gray-600">
                    {formatDate(a.date)}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange(a.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded border text-sm ${
                        a.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* 🔥 SEND INVOICE BUTTON */}
                  <td className="p-3">
                    <button
                      onClick={() => handleSendInvoice(a.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Send Invoice
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default StaffHistory;


/* ---------- DATE FORMAT ---------- */

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
};