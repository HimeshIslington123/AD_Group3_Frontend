import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Staffnotify = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          "http://localhost:5216/api/appointment/new"
        );

        if (res.data.length > 0) {
          // 🔔 Show toast
          toast.success(`🚗 ${res.data.length} New Appointment(s)!`);

          // Save to state (for dropdown)
          setNotifications(res.data);

          // ✅ Mark as notified (prevents repeat)
          await axios.post(
            "http://localhost:5216/api/appointment/mark-notified"
          );
        }
      } catch (err) {
        console.error("Notification error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* 🔔 Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-2xl"
      >
        🔔

        {/* Badge */}
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 z-50">
          <h3 className="font-semibold mb-2">New Appointments</h3>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No new notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="border-b py-2 text-sm"
              >
                🚗 {n.vehicle?.brand} {n.vehicle?.model} <br />
                📅 {new Date(n.date).toLocaleString()} <br />
                🔧 {n.serviceType}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Staffnotify;