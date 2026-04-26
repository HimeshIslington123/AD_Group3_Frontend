import { Car, Wrench, Star, History, Plus } from "lucide-react";

const vehicles = [
  {
    name: "Tesla Model 3",
    status: "Healthy",
    img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a",
  },
  {
    name: "Range Rover Sport",
    status: "Service Soon",
    img: "https://images.unsplash.com/photo-1619767886607-7c1f7d2f0b8c",
  },
];

const UserDashboard = () => {
  return (
    <div className="space-y-6">

      {/* TOP ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <ActionCard title="Add Vehicle" icon={<Plus />} />
        <ActionCard title="Book Service" icon={<Wrench />} />
        <ActionCard title="Request Part" icon={<Car />} />
        <ActionCard title="Write Review" icon={<Star />} />
        <ActionCard title="View History" icon={<History />} />

      </div>

      {/* GARAGE SECTION */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Garage</h2>

        <div className="grid md:grid-cols-2 gap-5">

          {vehicles.map((v, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">

              <img
                src={v.img}
                className="h-40 w-full object-cover rounded-lg"
              />

              <div className="mt-3 flex justify-between items-center">
                <h3 className="font-semibold">{v.name}</h3>

                <span className={`text-xs px-2 py-1 rounded-full ${
                  v.status === "Healthy"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}>
                  {v.status}
                </span>
              </div>

              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg">
                View Details
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* INFO WIDGETS */}
      <div className="grid md:grid-cols-3 gap-4">

        <InfoCard
          title="AI Wear Prediction"
          value="Brake pads: 300 miles left"
          color="bg-orange-50 text-orange-600"
        />

        <InfoCard
          title="Rewards"
          value="1,800 points"
          color="bg-blue-50 text-blue-600"
        />

        <InfoCard
          title="Balance"
          value="$0 Paid in full"
          color="bg-green-50 text-green-600"
        />

      </div>
    </div>
  );
};

export default UserDashboard;

/* ---------- Components ---------- */

const ActionCard = ({ title, icon }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition">
    <div className="text-blue-600">{icon}</div>
    <p className="text-sm font-medium">{title}</p>
  </div>
);

const InfoCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl ${color}`}>
    <h4 className="text-sm font-semibold">{title}</h4>
    <p className="text-xs mt-1">{value}</p>
  </div>
);