import { useState } from "react";
import { History, Wrench, ShoppingCart } from "lucide-react";

const serviceHistory = [
  {
    title: "Full Car Service",
    date: "2026-03-12",
    status: "Completed",
    price: "Rs. 8,500",
  },
  {
    title: "Brake Replacement",
    date: "2026-02-20",
    status: "Completed",
    price: "Rs. 4,200",
  },
];

const purchaseHistory = [
  {
    item: "Brake Pads",
    date: "2026-03-15",
    qty: 2,
    price: "Rs. 3,000",
  },
  {
    item: "Side Mirror",
    date: "2026-01-10",
    qty: 1,
    price: "Rs. 2,500",
  },
];

const appointmentHistory = [
  {
    service: "Engine Checkup",
    date: "2026-04-01",
    status: "Pending",
  },
  {
    service: "Oil Change",
    date: "2026-03-18",
    status: "Completed",
  },
];

const HistoryPage = () => {
  const [tab, setTab] = useState("service");

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          History
        </h1>
        <p className="text-sm text-slate-500">
          View your services, purchases and appointments
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm w-fit">

        <TabButton
          active={tab === "service"}
          onClick={() => setTab("service")}
          icon={<Wrench size={16} />}
          label="Service History"
        />

        <TabButton
          active={tab === "purchase"}
          onClick={() => setTab("purchase")}
          icon={<ShoppingCart size={16} />}
          label="Parts History"
        />

        <TabButton
          active={tab === "appointment"}
          onClick={() => setTab("appointment")}
          icon={<History size={16} />}
          label="Appointments"
        />
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        {/* SERVICE HISTORY */}
        {tab === "service" && (
          <div className="space-y-3">
            {serviceHistory.map((s, i) => (
              <HistoryCard
                key={i}
                title={s.title}
                date={s.date}
                extra={`Price: ${s.price}`}
                status={s.status}
              />
            ))}
          </div>
        )}

        {/* PURCHASE HISTORY */}
        {tab === "purchase" && (
          <div className="space-y-3">
            {purchaseHistory.map((p, i) => (
              <HistoryCard
                key={i}
                title={p.item}
                date={p.date}
                extra={`Qty: ${p.qty} • Price: ${p.price}`}
              />
            ))}
          </div>
        )}

        {/* APPOINTMENTS */}
        {tab === "appointment" && (
          <div className="space-y-3">
            {appointmentHistory.map((a, i) => (
              <HistoryCard
                key={i}
                title={a.service}
                date={a.date}
                status={a.status}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;

/* ---------- TAB BUTTON ---------- */

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
      active
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {icon}
    {label}
  </button>
);

/* ---------- HISTORY CARD ---------- */

const HistoryCard = ({ title, date, extra, status }) => (
  <div className="border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition">

    <div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500">{date}</p>
      {extra && <p className="text-xs text-slate-600 mt-1">{extra}</p>}
    </div>

    {status && (
      <span
        className={`text-xs px-3 py-1 rounded-full ${
          status === "Completed"
            ? "bg-green-100 text-green-600"
            : "bg-orange-100 text-orange-600"
        }`}
      >
        {status}
      </span>
    )}
  </div>
);