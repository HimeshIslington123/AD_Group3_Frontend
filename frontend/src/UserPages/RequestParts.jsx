import { useState, useEffect } from "react";
import axios from "axios";

const PART_REQUEST_API = "http://localhost:5216/api/partrequest";
const CUSTOMER_API = "http://localhost:5216/api/customer/my";
const PARTS_API = "http://localhost:5216/api/parts";

const RequestParts = () => {
  const [vehicles, setVehicles] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicleId: "",
    urgency: "Normal",
    notes: "",
  });

  const [search, setSearch] = useState("");

  // selected parts with quantity
  const [selectedParts, setSelectedParts] = useState([]);

  useEffect(() => {
    fetchCustomerVehicles();
    fetchParts();
  }, []);

  // =========================================================
  // FETCH VEHICLES
  // =========================================================
  const fetchCustomerVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(CUSTOMER_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(res.data?.vehicles || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================================
  // FETCH PARTS
  // =========================================================
  const fetchParts = async () => {
    try {
      const res = await axios.get(PARTS_API);

      setParts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // ADD PART
  // =========================================================
  const addPart = (part) => {
    const exists = selectedParts.find((p) => p.id === part.id);

    if (exists) return;

    setSelectedParts([
      ...selectedParts,
      {
        ...part,
        quantity: 1,
      },
    ]);
  };

  // =========================================================
  // REMOVE PART
  // =========================================================
  const removePart = (id) => {
    setSelectedParts(selectedParts.filter((p) => p.id !== id));
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================
  const updateQuantity = (id, qty) => {
    setSelectedParts(
      selectedParts.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: qty < 1 ? 1 : qty,
            }
          : p
      )
    );
  };

  // =========================================================
  // FILTER PARTS
  // =========================================================
  const filteredParts = parts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================================================
  // CALCULATIONS
  // =========================================================
  const total = selectedParts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = total >= 5000 ? total * 0.1 : 0;

  const finalTotal = total - discount;

  // =========================================================
  // SUBMIT
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!form.vehicleId) {
      alert("Select vehicle");
      return;
    }

    if (selectedParts.length === 0) {
      alert("Select parts");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        vehicleId: Number(form.vehicleId),
        urgency: form.urgency,
        notes: form.notes,

        items: selectedParts.map((part) => ({
          partId: Number(part.id ?? part.Id),
          quantity: Number(part.quantity),
        })),
      };

      await axios.post(PART_REQUEST_API, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Request submitted successfully ✅");

      setForm({
        vehicleId: "",
        urgency: "Normal",
        notes: "",
      });

      setSelectedParts([]);
      setSearch("");
    } catch (err) {
      console.log(err.response?.data || err.message);

      alert("Failed to submit ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* ========================================================= */}
      {/* TITLE */}
      {/* ========================================================= */}

      <h1 className="text-3xl font-bold mb-6">
        Request Parts
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ========================================================= */}
        {/* VEHICLE */}
        {/* ========================================================= */}

        <div>
          <label className="block mb-2 font-semibold">
            Select Vehicle
          </label>

          <select
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          >
            <option value="">Select Vehicle</option>

            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model}
              </option>
            ))}
          </select>
        </div>

        {/* ========================================================= */}
        {/* URGENCY */}
        {/* ========================================================= */}

        <div>
          <label className="block mb-2 font-semibold">
            Urgency
          </label>

          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          >
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
        </div>

        {/* ========================================================= */}
        {/* SEARCH */}
        {/* ========================================================= */}

        <div>
          <label className="block mb-2 font-semibold">
            Search Parts
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 w-full rounded"
            placeholder="Search parts..."
          />
        </div>

        {/* ========================================================= */}
        {/* PARTS */}
        {/* ========================================================= */}

        <div>
          <h2 className="text-xl font-bold mb-3">
            Available Parts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {filteredParts.map((part) => {
              const selected = selectedParts.find(
                (p) => p.id === part.id
              );

              return (
                <div
                  key={part.id}
                  className={`border rounded p-4 shadow-sm ${
                    selected
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <h3 className="font-bold text-lg">
                    {part.name}
                  </h3>

                  <p className="text-gray-600">
                    Rs {part.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {part.stockQuantity}
                  </p>

                  {!selected ? (
                    <button
                      type="button"
                      onClick={() => addPart(part)}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="mt-3 space-y-2">

                      <input
                        type="number"
                        min="1"
                        value={selected.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            part.id,
                            Number(e.target.value)
                          )
                        }
                        className="border p-2 w-full rounded"
                      />

                      <button
                        type="button"
                        onClick={() => removePart(part.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded w-full"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* ========================================================= */}
        {/* SELECTED PARTS SUMMARY */}
        {/* ========================================================= */}

        {selectedParts.length > 0 && (
          <div className="border rounded p-5 bg-gray-50">

            <h2 className="text-2xl font-bold mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">

              {selectedParts.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p>
                      Rs {item.price} × {item.quantity}
                    </p>

                    <p className="font-bold">
                      Rs {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* ========================================================= */}
            {/* TOTALS */}
            {/* ========================================================= */}

            <div className="mt-6 space-y-2">

              <div className="flex justify-between">
                <span>Total</span>

                <span>Rs {total}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Loyalty Discount (10%)</span>

                  <span>- Rs {discount}</span>
                </div>
              )}

              <div className="flex justify-between text-2xl font-bold border-t pt-3">
                <span>Final Total</span>

                <span>Rs {finalTotal}</span>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* NOTES */}
        {/* ========================================================= */}

        <div>
          <label className="block mb-2 font-semibold">
            Notes
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            rows="4"
            placeholder="Additional notes..."
          />
        </div>

        {/* ========================================================= */}
        {/* SUBMIT */}
        {/* ========================================================= */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded w-full text-lg font-bold"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

      </form>
    </div>
  );
};

export default RequestParts;