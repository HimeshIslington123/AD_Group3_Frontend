import { useState, useEffect } from "react";
import axios from "axios";
import {
  History,
  Wrench,
  ShoppingCart,
  Star,
  BadgePercent,
} from "lucide-react";

const API = "http://localhost:5216/api";

const HistoryPage = () => {
  const [tab, setTab] = useState("appointment");

  const [appointments, setAppointments] = useState([]);

  const [partRequests, setPartRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openReviewId, setOpenReviewId] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchPartRequests();
  }, []);

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/appointment/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH PART REQUESTS
  // =====================================================
  const fetchPartRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/partrequest/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPartRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================================
  // REVIEW
  // =====================================================
  const handleReviewChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitReview = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/review`,
        {
          appointmentId,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted ✅");

      setOpenReviewId(null);

      setReviewForm({
        rating: 5,
        comment: "",
      });

      fetchAppointments();
    } catch (err) {
      console.log(err);

      alert("Failed ❌");
    }
  };

  return (
    <div className="space-y-6">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <div>
        <h1 className="text-2xl font-bold">
          History
        </h1>

        <p className="text-sm text-gray-500">
          View services, purchases and appointments
        </p>
      </div>

      {/* ===================================================== */}
      {/* TABS */}
      {/* ===================================================== */}
      <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm w-fit">

        <TabButton
          active={tab === "service"}
          onClick={() => setTab("service")}
          icon={<Wrench size={16} />}
          label="Service"
        />

        <TabButton
          active={tab === "purchase"}
          onClick={() => setTab("purchase")}
          icon={<ShoppingCart size={16} />}
          label="Parts"
        />

        <TabButton
          active={tab === "appointment"}
          onClick={() => setTab("appointment")}
          icon={<History size={16} />}
          label="Appointments"
        />

      </div>

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}
      <div className="bg-white p-5 rounded-xl shadow">

        {/* ===================================================== */}
        {/* SERVICE */}
        {/* ===================================================== */}
        {tab === "service" && (
          <p>No service history yet</p>
        )}

        {/* ===================================================== */}
        {/* PART REQUESTS */}
        {/* ===================================================== */}
        {tab === "purchase" && (
          <div className="space-y-6">

            {partRequests.length === 0 ? (
              <p>No part requests found</p>
            ) : (
              partRequests.map((req) => {

                // =========================================
                // ORIGINAL TOTAL
                // =========================================
                const total =
                  req.items?.reduce(
                    (sum, item) =>
                      sum + item.price * item.quantity,
                    0
                  ) || 0;

                // =========================================
                // LOYALTY DISCOUNT
                // =========================================
                const hasDiscount = total > 5000;

                const discount = hasDiscount
                  ? total * 0.1
                  : 0;

                const finalTotal = total - discount;

                return (
                  <div
                    key={req.id}
                    className="border rounded-2xl p-5 shadow-sm bg-white"
                  >

                    {/* ===================================== */}
                    {/* HEADER */}
                    {/* ===================================== */}
                    <div className="flex justify-between items-start mb-4">

                      <div>
                        <h2 className="font-bold text-lg">
                          Invoice #{req.id}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(req.date)}
                        </p>

                        <p className="text-sm mt-1">
                          Vehicle:
                          {" "}
                          <span className="font-medium">
                            {req.vehicle?.brand}
                            {" "}
                            {req.vehicle?.model}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">

                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            req.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {req.status}
                        </span>

                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            req.paymentStatus === "Paid"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {req.paymentStatus}
                        </span>

                      </div>
                    </div>

                    {/* ===================================== */}
                    {/* ITEMS */}
                    {/* ===================================== */}
                    <div className="space-y-3">

                      {req.items?.map((item, idx) => {

                        const subtotal =
                          item.price * item.quantity;

                        return (
                          <div
                            key={idx}
                            className="border rounded-xl p-3 bg-gray-50"
                          >

                            <div className="flex justify-between">

                              <div>
                                <h3 className="font-semibold">
                                  {item.partName}
                                </h3>

                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Price: Rs {item.price}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-bold">
                                  Rs {subtotal}
                                </p>

                                <p className="text-xs text-gray-500">
                                  Subtotal
                                </p>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ===================================== */}
                    {/* LOYALTY DISCOUNT */}
                    {/* ===================================== */}
                    {hasDiscount && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">

                        <div className="flex items-center gap-2 text-green-700 font-semibold">

                          <BadgePercent size={18} />

                          Loyalty Discount Applied
                        </div>

                        <p className="text-sm text-green-600 mt-1">
                          You received 10% discount
                          because your purchase exceeded
                          Rs 5000.
                        </p>

                        <div className="mt-2 text-sm">
                          Discount:
                          {" "}
                          <span className="font-bold">
                            Rs {discount}
                          </span>
                        </div>

                      </div>
                    )}

                    {/* ===================================== */}
                    {/* TOTAL SECTION */}
                    {/* ===================================== */}
                    <div className="mt-5 border-t pt-4 space-y-2">

                      <div className="flex justify-between text-sm">
                        <span>Original Total</span>

                        <span>
                          Rs {total}
                        </span>
                      </div>

                      {hasDiscount && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount (10%)</span>

                          <span>
                            - Rs {discount}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Final Total</span>

                        <span>
                          Rs {finalTotal}
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* APPOINTMENTS */}
        {/* ===================================================== */}
        {tab === "appointment" && (
          <div className="space-y-4">

            {loading ? (
              <p>Loading...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments</p>
            ) : (
              appointments.map((a) => (
                <div
                  key={a.id}
                  className="border p-4 rounded-xl"
                >

                  <div className="flex justify-between">

                    <div>
                      <h3 className="font-semibold">
                        {a.serviceType}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {formatDate(a.date)}
                      </p>
                    </div>

                    <span className="text-xs">
                      {a.status}
                    </span>

                  </div>

                  {/* ================================= */}
                  {/* REVIEW */}
                  {/* ================================= */}
                  {a.status === "Completed" && (
                    <div className="mt-3">

                      {a.review ? (
                        <p className="text-sm text-green-600">
                          Review Submitted ⭐
                        </p>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setOpenReviewId(a.id)
                            }
                            className="bg-blue-600 text-white px-3 py-1 text-sm rounded"
                          >
                            Add Review
                          </button>

                          {openReviewId === a.id && (
                            <div className="mt-4 border rounded-xl p-4 space-y-3">

                              <div>
                                <label className="text-sm">
                                  Rating
                                </label>

                                <select
                                  name="rating"
                                  value={reviewForm.rating}
                                  onChange={handleReviewChange}
                                  className="border p-2 w-full rounded"
                                >
                                  <option value={5}>5</option>
                                  <option value={4}>4</option>
                                  <option value={3}>3</option>
                                  <option value={2}>2</option>
                                  <option value={1}>1</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-sm">
                                  Comment
                                </label>

                                <textarea
                                  name="comment"
                                  value={reviewForm.comment}
                                  onChange={handleReviewChange}
                                  className="border p-2 w-full rounded"
                                  rows={3}
                                />
                              </div>

                              <button
                                onClick={() =>
                                  submitReview(a.id)
                                }
                                className="bg-green-600 text-white px-4 py-2 rounded"
                              >
                                Submit Review
                              </button>

                            </div>
                          )}
                        </>
                      )}

                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;

// =====================================================
// HELPERS
// =====================================================
const formatDate = (date) =>
  new Date(date).toLocaleString();

// =====================================================
// TAB BUTTON
// =====================================================
const TabButton = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    {icon}
    {label}
  </button>
);