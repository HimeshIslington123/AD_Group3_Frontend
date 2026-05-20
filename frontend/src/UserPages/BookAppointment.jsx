import { useState, useEffect } from "react";
import axios from "axios";

const BookAppointment = () => {
  const [form, setForm] = useState({
    vehicleId: "",
    date: "",
    time: "",
    serviceType: "",
    searchParts: "",
    description: "",
  });

  const [vehicles, setVehicles] = useState([]);

  // 🔥 Fetch logged-in user's vehicles
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
 
const token = localStorage.getItem("token");
console.log("TOKEN:", token);
        const res = await axios.get(
          "http://localhost:5216/api/customer/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVehicles(res.data.vehicles);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchCustomer();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      vehicleId: form.vehicleId,
      date: new Date(`${form.date}T${form.time}`),
      serviceType: form.serviceType,
      description: form.description,
      searchParts: form.searchParts,
    };

    try {
      await axios.post(
        "http://localhost:5216/api/appointment",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment booked successfully ");

      // reset form
      setForm({
        vehicleId: "",
        date: "",
        time: "",
        serviceType: "",
        searchParts: "",
        description: "",
      });

    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment ❌");
    }
  };

  const services = [
    "General Service",
    "Engine Repair",
    "Oil Change",
    "Brake Service",
    "Full Inspection",
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Book Appointment
        </h1>
        <p className="text-sm text-slate-500">
          Schedule your vehicle service or request parts
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Vehicle Dropdown */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Select Vehicle
            </label>
            <select
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Choose your vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.vehicleNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Service Type
            </label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Search Parts */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Search Car Parts (Optional)
          </label>
          <input
            type="text"
            name="searchParts"
            value={form.searchParts}
            onChange={handleChange}
            placeholder="e.g. Brake pads, Engine oil..."
            className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Problem / Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Request Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;