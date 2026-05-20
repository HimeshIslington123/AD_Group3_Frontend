import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CUSTOMER_API =
  "http://localhost:5216/api/customer-report";

const FINANCIAL_API =
  "http://localhost:5216/api/financial-report";

const Adminreport = () => {
  // =========================
  // STATES
  // =========================
  const [regular, setRegular] = useState([]);
  const [highSpenders, setHighSpenders] = useState([]);
  const [pending, setPending] = useState([]);

  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH REPORTS
  // =========================
  const fetchReports = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        regularRes,
        spenderRes,
        pendingRes,
        dailyRes,
        monthlyRes,
        yearlyRes,
      ] = await Promise.all([
        axios.get(`${CUSTOMER_API}/regular`, {
          headers,
        }),

        axios.get(`${CUSTOMER_API}/high-spenders`, {
          headers,
        }),

        axios.get(`${CUSTOMER_API}/pending`, {
          headers,
        }),

        axios.get(`${FINANCIAL_API}/daily`, {
          headers,
        }),

        axios.get(`${FINANCIAL_API}/monthly`, {
          headers,
        }),

        axios.get(`${FINANCIAL_API}/yearly`, {
          headers,
        }),
      ]);

      setRegular(regularRes.data);
      setHighSpenders(spenderRes.data);
      setPending(pendingRes.data);

      setDaily(dailyRes.data);
      setMonthly(monthlyRes.data);
      setYearly(yearlyRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================
  // TOTALS
  // =========================
  const totalRevenue = yearly.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );

  const totalOrders = yearly.reduce(
    (sum, item) => sum + item.totalOrders,
    0
  );

  const totalPending = pending.reduce(
    (sum, item) => sum + item.pendingAmount,
    0
  );

  // =========================
  // CHART DATA
  // =========================

  // HIGH SPENDERS
  const spenderChart = {
    labels: highSpenders.map((x) => x.customerName),

    datasets: [
      {
        label: "Total Spent",
        data: highSpenders.map((x) => x.totalSpent),

        backgroundColor: [
          "#3B82F6",
          "#8B5CF6",
          "#F59E0B",
          "#10B981",
          "#EF4444",
        ],
      },
    ],
  };

  // PENDING
  const pendingChart = {
    labels: pending.map((x) => x.customerName),

    datasets: [
      {
        label: "Pending Amount",

        data: pending.map((x) => x.pendingAmount),

        borderColor: "#EF4444",

        backgroundColor: "rgba(239,68,68,0.2)",

        tension: 0.4,
      },
    ],
  };

  // DAILY
  const dailyChart = {
    labels: daily.map((x) => x.label),

    datasets: [
      {
        label: "Daily Revenue",

        data: daily.map((x) => x.totalRevenue),

        backgroundColor: "#10B981",
      },
    ],
  };

  // MONTHLY
  const monthlyChart = {
    labels: monthly.map((x) => x.label),

    datasets: [
      {
        label: "Monthly Revenue",

        data: monthly.map((x) => x.totalRevenue),

        backgroundColor: "#F59E0B",
      },
    ],
  };

  // YEARLY
  const yearlyChart = {
    labels: yearly.map((x) => x.label),

    datasets: [
      {
        label: "Yearly Revenue",

        data: yearly.map((x) => x.totalRevenue),

        backgroundColor: "#8B5CF6",
      },
    ],
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">

      {/* =========================
          HEADER
      ========================= */}
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Admin Reports 
        </h1>

        <p className="text-slate-500 mt-1">
          Financial reports & customer analytics
        </p>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-slate-500 text-sm">
            Total Revenue
          </h2>

          <p className="text-3xl font-bold text-green-600 mt-2">
            Rs {totalRevenue}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-slate-500 text-sm">
            Total Orders
          </h2>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-slate-500 text-sm">
            Pending Credits
          </h2>

          <p className="text-3xl font-bold text-red-500 mt-2">
            Rs {totalPending}
          </p>
        </div>

      </div>

      {/* =========================
          CUSTOMER REPORTS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* HIGH SPENDERS */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            High Spenders
          </h2>

          <Pie data={spenderChart} />
        </div>

        {/* PENDING */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Pending Credits
          </h2>

          <Line data={pendingChart} />
        </div>

      </div>

      {/* =========================
          FINANCIAL REPORTS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* DAILY */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Daily Revenue
          </h2>

          <Bar data={dailyChart} />
        </div>

        {/* MONTHLY */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Revenue
          </h2>

          <Line data={monthlyChart} />
        </div>

        {/* YEARLY */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Yearly Revenue
          </h2>

          <Bar data={yearlyChart} />
        </div>

      </div>

      {/* =========================
          TABLE
      ========================= */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">

        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold">
            Regular Customers
          </h2>
        </div>

        <table className="w-full text-left">

          <thead className="bg-slate-100 text-slate-600 text-sm">

            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Pending</th>
            </tr>

          </thead>

          <tbody>

            {regular.map((customer) => (
              <tr
                key={customer.customerId}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {customer.customerName}
                </td>

                <td className="p-4">
                  {customer.totalOrders}
                </td>

                <td className="p-4 text-green-600 font-semibold">
                  Rs {customer.totalSpent}
                </td>

                <td className="p-4 text-red-500 font-semibold">
                  Rs {customer.pendingAmount}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Adminreport;