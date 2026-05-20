import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  BadgePercent,
  PackageCheck,
  Clock3,
  Truck,
} from "lucide-react";

const API = "http://localhost:5216/api/partrequest";

const SalesInvoice = () => {
  const [requests, setRequests] = useState([]);

  // ====================================================
  // FETCH REQUESTS
  // ====================================================
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ====================================================
  // SEND EMAIL
  // ====================================================
  const sendEmail = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/${id}/send-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Email sent successfully ✅");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to send email"
      );
    }
  };

  // ====================================================
  // UPDATE STATUS
  // ====================================================
  const updateStatus = async (
    id,
    status,
    paymentStatus
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/${id}/status`,
        {
          status,
          paymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequests();

      alert("Updated Successfully ✅");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    }
  };

  const handleDeliveryChange = (
    id,
    value,
    paymentStatus
  ) => {
    updateStatus(id, value, paymentStatus);
  };

  const handlePaymentChange = (
    id,
    status,
    value
  ) => {
    updateStatus(id, status, value);
  };

  // ====================================================
  // UI
  // ====================================================
  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Sales & Customer Requests
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Manage customer requested parts
        </p>
      </div>

      {/* ================================================= */}
      {/* REQUESTS */}
      {/* ================================================= */}
      <div className="space-y-6">

        {requests.length > 0 ? (
          requests.map((request) => {

            // =============================================
            // ITEMS
            // =============================================
            const items =
              request.items?.filter(Boolean) || [];

            // =============================================
            // TOTAL QTY
            // =============================================
            const totalQty = items.reduce(
              (sum, item) =>
                sum + (item.quantity || 0),
              0
            );

            // =============================================
            // TOTAL PRICE
            // =============================================
            const totalPrice = items.reduce(
              (sum, item) =>
                sum +
                (item.subTotal ??
                  item.price * item.quantity ??
                  0),
              0
            );

            // =============================================
            // DISCOUNT
            // =============================================
            const hasDiscount = totalPrice > 5000;

            const discount = hasDiscount
              ? totalPrice * 0.1
              : 0;

            const finalTotal =
              totalPrice - discount;

            return (
              <div
                key={request.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              >

                {/* ======================================= */}
                {/* TOP HEADER */}
                {/* ======================================= */}
                <div className="p-5 border-b bg-slate-50">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* LEFT */}
                    <div>

                      <h2 className="text-xl font-bold text-slate-800">
                        Invoice #{request.id}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Customer:
                        {" "}
                        <span className="font-medium text-slate-700">
                          {request.vehicle?.customer
                            ?.fullName || "N/A"}
                        </span>
                      </p>

                      <p className="text-sm text-slate-500">
                        Vehicle:
                        {" "}
                        <span className="font-medium text-slate-700">
                          {request.vehicle?.brand}
                          {" "}
                          {request.vehicle?.model}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(
                          request.date
                        ).toLocaleString()}
                      </p>

                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-wrap gap-3">

                      {/* URGENCY */}
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-semibold ${
                          request.urgency === "High"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.urgency}
                      </span>

                      {/* DELIVERY STATUS */}
                      <div className="flex items-center gap-2">

                        {request.status ===
                        "Delivered" ? (
                          <PackageCheck
                            size={18}
                            className="text-green-600"
                          />
                        ) : request.status ===
                          "Processing" ? (
                          <Truck
                            size={18}
                            className="text-blue-600"
                          />
                        ) : (
                          <Clock3
                            size={18}
                            className="text-yellow-600"
                          />
                        )}

                        <select
                          value={request.status}
                          onChange={(e) =>
                            handleDeliveryChange(
                              request.id,
                              e.target.value,
                              request.paymentStatus
                            )
                          }
                          className="border rounded-lg p-2 text-sm"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>
                        </select>

                      </div>

                      {/* PAYMENT */}
                      <select
                        value={
                          request.paymentStatus
                        }
                        onChange={(e) =>
                          handlePaymentChange(
                            request.id,
                            request.status,
                            e.target.value
                          )
                        }
                        className={`border rounded-lg p-2 text-sm font-medium ${
                          request.paymentStatus ===
                          "Paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <option value="Unpaid">
                          Unpaid
                        </option>

                        <option value="Paid">
                          Paid
                        </option>
                      </select>

                    </div>
                  </div>
                </div>

                {/* ======================================= */}
                {/* ITEMS */}
                {/* ======================================= */}
                <div className="p-5">

                  <h3 className="font-semibold text-slate-700 mb-4">
                    Requested Parts
                  </h3>

                  <div className="space-y-3">

                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <div
                          key={idx}
                          className="border rounded-xl p-4 bg-slate-50"
                        >

                          <div className="flex justify-between items-start">

                            {/* LEFT */}
                            <div>

                              <h4 className="font-semibold text-slate-800">
                                {item.part?.name ||
                                  "Unknown Part"}
                              </h4>

                              <p className="text-xs text-slate-500 mt-1">
                                Quantity:
                                {" "}
                                {item.quantity}
                              </p>

                              <p className="text-xs text-slate-500">
                                Price:
                                {" "}
                                Rs {item.price}
                              </p>

                            </div>

                            {/* RIGHT */}
                            <div className="text-right">

                              <p className="font-bold text-slate-800">
                                Rs {item.subTotal}
                              </p>

                              <p className="text-xs text-slate-500">
                                Subtotal
                              </p>

                            </div>

                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        No items
                      </p>
                    )}

                  </div>

                  {/* =================================== */}
                  {/* DISCOUNT */}
                  {/* =================================== */}
                  {hasDiscount && (
                    <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">

                      <div className="flex items-center gap-2 text-green-700 font-semibold">

                        <BadgePercent size={18} />

                        Loyalty Discount Applied
                      </div>

                      <p className="text-sm text-green-600 mt-1">
                        Customer received 10%
                        discount for purchases
                        above Rs 5000.
                      </p>

                      <p className="mt-2 text-sm font-semibold text-green-700">
                        Discount:
                        {" "}
                        Rs {discount}
                      </p>

                    </div>
                  )}

                  {/* =================================== */}
                  {/* TOTALS */}
                  {/* =================================== */}
                  <div className="mt-6 border-t pt-4 space-y-2">

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Total Quantity
                      </span>

                      <span className="font-semibold">
                        {totalQty}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Original Total
                      </span>

                      <span className="font-semibold">
                        Rs {totalPrice}
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>
                          Discount (10%)
                        </span>

                        <span>
                          - Rs {discount}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xl font-bold border-t pt-3">

                      <span>Final Total</span>

                      <span className="text-green-600">
                        Rs {finalTotal}
                      </span>

                    </div>
                  </div>

                  {/* =================================== */}
                  {/* ACTION BUTTON */}
                  {/* =================================== */}
                  <div className="mt-6 flex justify-end">

                    <button
                      onClick={() =>
                        sendEmail(request.id)
                      }
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
                    >
                      <Mail size={18} />
                      Send Email
                    </button>

                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border p-10 text-center text-slate-500">
            No Requests Found
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesInvoice;