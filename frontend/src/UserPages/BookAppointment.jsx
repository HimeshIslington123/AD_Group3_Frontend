import { useState } from "react";

const BookAppointment = () => {
  const [form, setForm] = useState({
    car: "",
    date: "",
    time: "",
    serviceType: "",
    searchParts: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", form);
    alert("Appointment Requested Successfully!");
  };

  const cars = [
    "Toyota Corolla",
    "Honda Civic",
    "Hyundai Creta",
    "Suzuki Swift",
  ];

  const services = [
    "General Service",
    "Engine Repair",
    "Oil Change",
    "Brake Service",
    "Full Inspection",
  ];

  return (
    <div className="max-w-5xl mx-auto">
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

          {/* Car Select */}
          <div>
            <label className="text-sm font-medium text-slate-600">
              Select Car
            </label>
            <select
              name="car"
              value={form.car}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Choose your car</option>
              {cars.map((c) => (
                <option key={c} value={c}>
                  {c}
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

        {/* SEARCH PARTS */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Search Car Parts (Optional)
          </label>
          <input
            type="text"
            name="searchParts"
            value={form.searchParts}
            onChange={handleChange}
            placeholder="e.g. Brake pads, Engine oil, Air filter..."
            className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Problem / Request Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your vehicle issue or request..."
            className="w-full mt-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Request Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;