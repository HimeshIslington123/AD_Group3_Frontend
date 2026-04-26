import React from "react";

const LoyaltyPage = () => {
  // demo data (later replace from backend)
  const totalSpent = 4200; // current spending
  const target = 5000;

  const progress = Math.min((totalSpent / target) * 100, 100);
  const isEligible = totalSpent >= target;

  const history = [
    {
      id: 1,
      purchase: "Brake Pads + Service",
      amount: 3200,
      date: "2026-03-12",
    },
    {
      id: 2,
      purchase: "Engine Oil",
      amount: 1000,
      date: "2026-02-18",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Loyalty Program
        </h1>
        <p className="text-sm text-slate-500">
          Earn rewards based on your total spending
        </p>
      </div>

      {/* STATUS CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-lg font-semibold">
              Your Loyalty Status
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Spend Rs. 5000 in a single purchase to unlock discount
            </p>
          </div>

          <span
            className={`px-3 py-1 text-sm rounded-full font-semibold ${
              isEligible
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {isEligible ? "Eligible 🎉" : "In Progress"}
          </span>

        </div>

        {/* PROGRESS BAR */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Rs. {totalSpent}</span>
            <span>Rs. {target}</span>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-2">
            {isEligible
              ? "You unlocked 10% discount!"
              : `Spend Rs. ${target - totalSpent} more to unlock 10% discount`}
          </p>
        </div>

      </div>

      {/* BENEFITS CARD */}
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">

        <h3 className="font-semibold text-blue-700">
          🎁 Loyalty Benefit
        </h3>

        <p className="text-sm text-blue-600 mt-1">
          Get <b>10% discount</b> on your next eligible purchase after spending Rs. 5000 in a single order.
        </p>

      </div>

      {/* HISTORY */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">

        <h2 className="font-semibold mb-4">Recent Purchases</h2>

        <div className="space-y-3">

          {history.map((h) => (
            <div
              key={h.id}
              className="flex justify-between items-center border p-3 rounded-lg"
            >

              <div>
                <p className="font-medium text-slate-700">
                  {h.purchase}
                </p>
                <p className="text-xs text-slate-500">{h.date}</p>
              </div>

              <span className="font-semibold text-slate-700">
                Rs. {h.amount}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default LoyaltyPage;