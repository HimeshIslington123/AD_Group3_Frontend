import {
  Car,
  Wrench,
  Star,
  History,
  Plus,
  Calendar,
  ShieldCheck,
  Gauge,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PROFILE_API = "http://localhost:5216/api/customer/my";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH CUSTOMER + VEHICLES
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(PROFILE_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomer(res.data);
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Add Vehicle",
      icon: <Plus size={20} />,
      path: "/user/profile",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Book Service",
      icon: <Wrench size={20} />,
      path: "/user/bookappointment",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Request Part",
      icon: <Car size={20} />,
      path: "/user/requestpart",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "View History",
      icon: <History size={20} />,
      path: "/user/history",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "My Profile",
      icon: <Star size={20} />,
      path: "/user/profile",
      color: "bg-pink-50 text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-sm opacity-90">Welcome back 👋</p>

            <h1 className="text-3xl font-bold mt-1">
              {customer?.fullName}
            </h1>

            <p className="mt-2 text-blue-100">
              Manage your vehicles, appointments, and service history
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 min-w-[130px]">
              <p className="text-sm text-blue-100">Vehicles</p>

              <h2 className="text-3xl font-bold mt-1">
                {vehicles.length}
              </h2>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 min-w-[130px]">
              <p className="text-sm text-blue-100">Status</p>

              <h2 className="text-lg font-semibold mt-2">
                Active Customer
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition text-left"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
              >
                {item.icon}
              </div>

              <h3 className="font-semibold">{item.title}</h3>

              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                Open
                <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* VEHICLES */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">My Garage</h2>

          <button
            onClick={() => navigate("/user/profile")}
            className="text-blue-600 text-sm font-medium"
          >
            Manage Vehicles
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <Car size={40} className="mx-auto text-gray-300 mb-3" />

            <h3 className="font-semibold text-lg">No Vehicles Added</h3>

            <p className="text-gray-500 text-sm mt-1">
              Add your first vehicle from profile page
            </p>

            <button
              onClick={() => navigate("/user/profile")}
              className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition"
              >
                {/* CAR IMAGE */}
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
                  alt="vehicle"
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  {/* TOP */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">
                        {v.brand} {v.model}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {v.vehicleNumber}
                      </p>
                    </div>

                    <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <VehicleInfo
                      icon={<Calendar size={16} />}
                      label="Year"
                      value={v.year}
                    />

                    <VehicleInfo
                      icon={<Car size={16} />}
                      label="Type"
                      value={v.type}
                    />

                    <VehicleInfo
                      icon={<Gauge size={16} />}
                      label="Model"
                      value={v.model}
                    />

                    <VehicleInfo
                      icon={<ShieldCheck size={16} />}
                      label="Brand"
                      value={v.brand}
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => navigate("/user/bookappointment")}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium"
                    >
                      Book Service
                    </button>

                    <button
                      onClick={() => navigate("/user/requestpart")}
                      className="flex-1 border border-gray-200 py-2 rounded-xl text-sm font-medium"
                    >
                      Request Part
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default UserDashboard;

/* ---------- COMPONENTS ---------- */

const VehicleInfo = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      {icon}
      {label}
    </div>

    <p className="font-semibold mt-1">{value}</p>
  </div>
);

const InfoCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl ${color}`}>
    <h4 className="font-semibold">{title}</h4>

    <p className="text-sm mt-2">{value}</p>
  </div>
);