import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API = "http://localhost:5216/api/customer-report";



const Reports = () => {
  const [regular, setRegular] = useState([]);
  const [highSpenders, setHighSpenders] = useState([]);
  const [pending, setPending] = useState([]);

  const token = localStorage.getItem("token");

  // ======================
  // FETCH ALL REPORTS
  // ======================
  const fetchReports = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [r1, r2, r3] = await Promise.all([
        axios.get(`${API}/regular`, { headers }),
        axios.get(`${API}/high-spenders`, { headers }),
        axios.get(`${API}/pending`, { headers }),
      ]);

      setRegular(r1.data);
      setHighSpenders(r2.data);
      setPending(r3.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ======================
  // CHART DATA - HIGH SPENDERS
  // ======================
  const barData = {
    labels: highSpenders.map((x) => x.customerName),
    datasets: [
      {
        label: "Total Spent (Rs)",
        data: highSpenders.map((x) => x.totalSpent),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // ======================
  // CHART DATA - PENDING
  // ======================
  const lineData = {
    labels: pending.map((x) => x.customerName),
    datasets: [
      {
        label: "Pending Amount (Rs)",
        data: pending.map((x) => x.pendingAmount),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
      },
    ],
  };

  return (
    <div className="p-6 space-y-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-slate-800">
        Customer Reports Dashboard
      </h1>

      {/* ======================
          CHARTS
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* HIGH SPENDERS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">High Spenders</h2>
          <Bar data={barData} />
        </div>

        {/* PENDING CREDIT */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Pending Credits</h2>
          <Line data={lineData} />
        </div>
      </div>

      {/* ======================
          TABLE - REGULAR
      ====================== */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Regular Customers</h2>

        <table className="w-full text-left border">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Orders</th>
              <th className="p-2">Total Spent</th>
              <th className="p-2">Pending</th>
            </tr>
          </thead>

          <tbody>
            {regular.map((c) => (
              <tr key={c.customerId} className="border-t">
                <td className="p-2">{c.customerName}</td>
                <td className="p-2">{c.totalOrders}</td>
                <td className="p-2 text-green-600">
                  Rs {c.totalSpent}
                </td>
                <td className="p-2 text-red-500">
                  Rs {c.pendingAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;