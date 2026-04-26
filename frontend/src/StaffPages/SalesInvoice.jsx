import React, { useState } from "react";

const partsData = [
  { name: "Brake Pads", price: 1200 },
  { name: "Engine Oil", price: 800 },
  { name: "Side Mirror", price: 1500 },
  { name: "Air Filter", price: 600 },
];

const customersData = [
  { id: 1, name: "Ram Shrestha", phone: "9800001111" },
  { id: 2, name: "Sita Rai", phone: "9811112222" },
];

const SalesInvoice = () => {
  const [customer, setCustomer] = useState("");
  const [cart, setCart] = useState([]);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  const addPart = (part) => {
    setCart([...cart, part]);
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const generateInvoice = () => {
    setInvoiceGenerated(true);
    alert("Invoice Generated!");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Sales & Invoice
        </h1>
        <p className="text-sm text-slate-500">
          Sell parts and generate customer invoice
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* CUSTOMER SELECT */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-3">Select Customer</h2>

          <select
            className="w-full border p-2 rounded-lg"
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option>Select customer</option>
            {customersData.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* PARTS */}
        <div className="bg-white p-4 rounded-xl border shadow-sm md:col-span-2">
          <h2 className="font-semibold mb-3">Add Parts</h2>

          <div className="grid grid-cols-2 gap-3">
            {partsData.map((p, i) => (
              <button
                key={i}
                onClick={() => addPart(p)}
                className="border p-2 rounded-lg hover:bg-blue-50 text-sm"
              >
                {p.name} - Rs.{p.price}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* CART */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">

        <h2 className="font-semibold mb-3">Invoice Cart</h2>

        {cart.length === 0 ? (
          <p className="text-sm text-slate-500">No items added</p>
        ) : (
          <div className="space-y-2">

            {cart.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border p-2 rounded-lg"
              >
                <p>{item.name}</p>
                <div className="flex gap-4">
                  <p>Rs. {item.price}</p>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right font-bold mt-3">
              Total: Rs. {total}
            </div>

          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-4">

          <button
            onClick={generateInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Generate Invoice
          </button>

          <button className="border px-4 py-2 rounded-lg">
            Print
          </button>

          <button className="border px-4 py-2 rounded-lg">
            Email
          </button>

        </div>

      </div>

    </div>
  );
};

export default SalesInvoice;