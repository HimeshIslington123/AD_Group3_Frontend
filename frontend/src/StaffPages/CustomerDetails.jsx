import React, { useState } from "react";

const customersData = [
  {
    id: 1,
    name: "Ram Shrestha",
    phone: "9800001111",
    address: "Kathmandu",
    vehicle: {
      model: "Toyota Corolla",
      number: "BA 12 PA 1234",
    },
    serviceHistory: [
      { item: "Brake Service", date: "2026-01-10", cost: 2500 },
      { item: "Oil Change", date: "2026-02-15", cost: 1200 },
    ],
    purchaseHistory: [
      { item: "Engine Oil", date: "2026-02-15", cost: 800 },
    ],
  },

  {
    id: 2,
    name: "Sita Rai",
    phone: "9811112222",
    address: "Lalitpur",
    vehicle: {
      model: "Honda Civic",
      number: "BA 15 PA 9999",
    },
    serviceHistory: [
      { item: "Full Service", date: "2026-03-01", cost: 5000 },
    ],
    purchaseHistory: [
      { item: "Air Filter", date: "2026-03-01", cost: 600 },
    ],
  },
];

const CustomerDetails = () => {
  const [selected, setSelected] = useState(customersData[0]);

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* ================= CUSTOMER LIST ================= */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">

        <h2 className="font-semibold mb-3 text-slate-800">
          Customers
        </h2>

        <div className="space-y-2">

          {customersData.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`p-3 rounded-lg cursor-pointer border transition ${
                selected?.id === c.id
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-slate-50"
              }`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-slate-500">{c.phone}</p>
            </div>
          ))}

        </div>

      </div>

      {/* ================= DETAILS PANEL ================= */}
      <div className="md:col-span-2 space-y-5">

        {/* CUSTOMER INFO */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            {selected.name}
          </h2>

          <p className="text-sm text-slate-500">
            📞 {selected.phone}
          </p>

          <p className="text-sm text-slate-500">
            📍 {selected.address}
          </p>

        </div>

        {/* VEHICLE INFO */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h3 className="font-semibold mb-2">Vehicle Info</h3>

          <p className="text-sm">
            🚗 Model: <b>{selected.vehicle.model}</b>
          </p>

          <p className="text-sm">
            🔢 Number: <b>{selected.vehicle.number}</b>
          </p>

        </div>

        {/* SERVICE HISTORY */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h3 className="font-semibold mb-3">
            Service History
          </h3>

          <div className="space-y-2">

            {selected.serviceHistory.length === 0 ? (
              <p className="text-sm text-slate-500">
                No service history
              </p>
            ) : (
              selected.serviceHistory.map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between border p-2 rounded-lg"
                >
                  <p>{s.item}</p>
                  <span className="text-xs text-slate-500">
                    {s.date} • Rs.{s.cost}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>

        {/* PURCHASE HISTORY */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h3 className="font-semibold mb-3">
            Purchase History
          </h3>

          <div className="space-y-2">

            {selected.purchaseHistory.length === 0 ? (
              <p className="text-sm text-slate-500">
                No purchase history
              </p>
            ) : (
              selected.purchaseHistory.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between border p-2 rounded-lg"
                >
                  <p>{p.item}</p>
                  <span className="text-xs text-slate-500">
                    {p.date} • Rs.{p.cost}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default CustomerDetails;