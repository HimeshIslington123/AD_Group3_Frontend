import React, { useEffect, useState } from "react";
import axios from "axios";

const PROFILE_API = "http://localhost:5216/api/customer/my";
const CUSTOMER_API = "http://localhost:5216/api/customer";

const Profile = () => {
  const [customer, setCustomer] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    vehicles: [],
  });

  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  // FETCH PROFILE
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

      // SET FORM DATA
      setForm({
        fullName: res.data.fullName || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        vehicles: res.data.vehicles || [],
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = () => {
    setIsOpen(true);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // VEHICLE CHANGE
  const handleVehicleChange = (index, e) => {
    const updatedVehicles = [...form.vehicles];

    updatedVehicles[index][e.target.name] =
      e.target.name === "year" ? Number(e.target.value) : e.target.value;

    setForm({
      ...form,
      vehicles: updatedVehicles,
    });
  };

  // ADD VEHICLE
  const addVehicle = () => {
    setForm({
      ...form,
      vehicles: [
        ...form.vehicles,
        {
          id: 0,
          vehicleNumber: "",
          brand: "",
          model: "",
          year: "",
          type: "",
        },
      ],
    });
  };

  // REMOVE VEHICLE
  const removeVehicle = (index) => {
    const updatedVehicles = [...form.vehicles];

    updatedVehicles.splice(index, 1);

    setForm({
      ...form,
      vehicles: updatedVehicles,
    });
  };

  // UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(`${CUSTOMER_API}/${customer.id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile Updated Successfully");

      setIsOpen(false);

      fetchProfile();
    } catch (err) {
      console.log(err.response?.data);

      alert("Update failed");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!customer) {
    return (
      <div className="p-6 text-center text-red-500">Profile not found</div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>

            <p className="text-gray-500">Manage your account details</p>
          </div>

          <button
            onClick={openEditModal}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        </div>

        {/* CUSTOMER INFO */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>

            <div className="border rounded-lg p-3 mt-1 bg-gray-50">
              {customer.fullName}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>

            <div className="border rounded-lg p-3 mt-1 bg-gray-50">
              {customer.email}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone</label>

            <div className="border rounded-lg p-3 mt-1 bg-gray-50">
              {customer.phone}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Address</label>

            <div className="border rounded-lg p-3 mt-1 bg-gray-50">
              {customer.address}
            </div>
          </div>
        </div>

        {/* VEHICLES */}
        <div>
          <h2 className="text-2xl font-semibold mb-5">My Vehicles</h2>

          {customer.vehicles?.length === 0 ? (
            <div className="border rounded-xl p-4 bg-gray-50 text-gray-500">
              No vehicles found
            </div>
          ) : (
            <div className="grid gap-5">
              {customer.vehicles?.map((v) => (
                <div key={v.id} className="border rounded-xl p-5 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold">Vehicle No:</span>{" "}
                      {v.vehicleNumber}
                    </div>

                    <div>
                      <span className="font-semibold">Type:</span> {v.type}
                    </div>

                    <div>
                      <span className="font-semibold">Brand:</span> {v.brand}
                    </div>

                    <div>
                      <span className="font-semibold">Model:</span> {v.model}
                    </div>

                    <div>
                      <span className="font-semibold">Year:</span> {v.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-5">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CUSTOMER */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border p-3 rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-3 rounded-lg"
                  required
                />
              </div>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-3 rounded-lg w-full"
                required
              />

              {/* VEHICLES */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Vehicles</h3>

                  <button
                    type="button"
                    onClick={addVehicle}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    + Add Vehicle
                  </button>
                </div>

                {form.vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-4 space-y-3 bg-gray-50"
                  >
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        name="vehicleNumber"
                        value={vehicle.vehicleNumber}
                        onChange={(e) => handleVehicleChange(index, e)}
                        placeholder="Vehicle Number"
                        className="border p-2 rounded"
                      />

                      <input
                        name="type"
                        value={vehicle.type}
                        onChange={(e) => handleVehicleChange(index, e)}
                        placeholder="Type"
                        className="border p-2 rounded"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        name="brand"
                        value={vehicle.brand}
                        onChange={(e) => handleVehicleChange(index, e)}
                        placeholder="Brand"
                        className="border p-2 rounded"
                      />

                      <input
                        name="model"
                        value={vehicle.model}
                        onChange={(e) => handleVehicleChange(index, e)}
                        placeholder="Model"
                        className="border p-2 rounded"
                      />

                      <input
                        type="number"
                        name="year"
                        value={vehicle.year}
                        onChange={(e) => handleVehicleChange(index, e)}
                        placeholder="Year"
                        className="border p-2 rounded"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="text-red-600 text-sm"
                    >
                      Remove Vehicle
                    </button>
                  </div>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
