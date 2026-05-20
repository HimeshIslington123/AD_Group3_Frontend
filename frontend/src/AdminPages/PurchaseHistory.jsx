import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseHistory = () => {
  const [invoices, setInvoices] = useState([]);

  // FETCH PURCHASE HISTORY
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5216/api/PurchaseInvoice"
      );

      setInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-8 bg-white rounded-2xl shadow">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Purchase History
        </h1>

        <p className="text-slate-500 mt-1">
          View all purchased products
        </p>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full border rounded-xl overflow-hidden">

          <thead className="bg-slate-100">

            <tr className="text-left">

              <th className="p-4">
                Invoice ID
              </th>

              <th className="p-4">
                Vendor
              </th>

              <th className="p-4">
                Date
              </th>

              <th className="p-4">
                Products
              </th>

              <th className="p-4">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-t align-top"
              >

                {/* ID */}
                <td className="p-4 font-semibold">
                  #{invoice.id}
                </td>

                {/* VENDOR */}
                <td className="p-4">
                  {invoice.vendor?.name}
                </td>

                {/* DATE */}
                <td className="p-4">
                  {new Date(
                    invoice.date
                  ).toLocaleDateString()}
                </td>

                {/* PRODUCTS */}
                <td className="p-4">

                  <div className="space-y-2">

                    {invoice.items?.map((item) => (

                      <div
                        key={item.id}
                        className="border rounded-lg p-3 bg-slate-50"
                      >

                        <div className="font-medium">
                          {item.part?.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          Qty: {item.quantity}
                        </div>

                        <div className="text-sm text-slate-500">
                          Price: Rs.
                          {item.unitPrice}
                        </div>

                        <div className="text-sm font-semibold">
                          Subtotal: Rs.
                          {(
                            item.quantity *
                            item.unitPrice
                          ).toFixed(2)}
                        </div>

                      </div>
                    ))}

                  </div>

                </td>

                {/* TOTAL */}
                <td className="p-4 font-bold text-green-600">
                  Rs.
                  {invoice.totalAmount?.toFixed(2)}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default PurchaseHistory;