import { useState } from "react";

const partsList = [
  "Side Mirror",
  "Brake Pads",
  "Brake Disc",
  "Engine Oil",
  "Air Filter",
  "Oil Filter",
  "Spark Plug",
  "Headlight",
  "Tail Light",
  "Battery",
  "Tyres",
  "Wiper Blades",
  "Radiator",
  "Clutch Plate",
];

const RequestParts = () => {
  const [car, setCar] = useState("");
  const [search, setSearch] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState("Normal");
  const [notes, setNotes] = useState("");

  const cars = ["Toyota Corolla", "Honda Civic", "Hyundai Creta", "Swift"];

  const togglePart = (part) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const filteredParts = partsList.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      car,
      selectedParts,
      quantity,
      urgency,
      notes,
    };

    console.log("PART REQUEST:", data);
    alert("Car parts request submitted!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">
        Request Car Parts
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Select parts you need for your vehicle service
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        {/* CAR SELECT */}
        <div>
          <label className="text-sm font-medium">Select Car</label>
          <select
            value={car}
            onChange={(e) => setCar(e.target.value)}
            className="w-full mt-1 border p-3 rounded-lg"
            required
          >
            <option value="">Choose car</option>
            {cars.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* SEARCH PARTS */}
        <div>
          <label className="text-sm font-medium">Search Parts</label>
          <input
            type="text"
            placeholder="Search brake, mirror, engine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-1 border p-3 rounded-lg"
          />
        </div>

        {/* PARTS GRID */}
        <div>
          <h2 className="font-semibold mb-2 text-slate-700">
            Available Parts
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredParts.map((part) => (
              <div
                key={part}
                onClick={() => togglePart(part)}
                className={`cursor-pointer p-3 rounded-lg border text-sm text-center transition ${
                  selectedParts.includes(part)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                {part}
              </div>
            ))}
          </div>
        </div>

        {/* QUANTITY + URGENCY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-1 border p-3 rounded-lg"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="text-sm font-medium">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full mt-1 border p-3 rounded-lg"
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>Very Urgent</option>
            </select>
          </div>
        </div>

        {/* NOTES */}
        <div>
          <label className="text-sm font-medium">
            Additional Notes
          </label>
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-1 border p-3 rounded-lg"
            placeholder="Any extra requirement..."
          />
        </div>

        {/* SELECTED PREVIEW */}
        {selectedParts.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-lg text-sm">
            <strong>Selected Parts:</strong>{" "}
            {selectedParts.join(", ")}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Parts Request
        </button>
      </form>
    </div>
  );
};

export default RequestParts;