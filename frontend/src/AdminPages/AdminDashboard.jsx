import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:51391/api";

const Dashboard = () => {
  const [data, setData] = useState({
    staffCount: 0,
    vendorCount: 0,
    partCount: 0,
    invoiceCount: 0
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [staff, vendors, parts, invoices] = await Promise.all([
          axios.get(`${BASE_URL}/auth/users`, getHeaders()),
          axios.get(`${BASE_URL}/Vendor`, getHeaders()),
          axios.get(`${BASE_URL}/Part`, getHeaders()),
          axios.get(`${BASE_URL}/PurchaseInvoice`, getHeaders())
        ]);

        setData({
          staffCount: staff.data.length,
          vendorCount: vendors.data.length,
          partCount: parts.data.length,
          invoiceCount: invoices.data.length
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Total Staff", value: data.staffCount, icon: "group", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Vendors", value: data.vendorCount, icon: "local_shipping", color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Parts", value: data.partCount, icon: "inventory_2", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Purchase Invoices", value: data.invoiceCount, icon: "receipt_long", color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time overview of your AutoPart business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">{item.title}</p>
                <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
              </div>
              <div className={`p-4 rounded-lg ${item.bg}`}>
                <span className={`material-symbols-outlined ${item.color} text-2xl`}>{item.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-sm bg-gradient-to-br from-white to-blue-50/30">
        <h3 className="text-xl font-bold mb-4 text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border rounded-xl hover:border-blue-500 transition cursor-default">
            <p className="font-semibold text-slate-700">Manage Staff</p>
            <p className="text-sm text-slate-500">Update roles and register new accounts</p>
          </div>
          <div className="p-4 bg-white border rounded-xl hover:border-blue-500 transition cursor-default">
            <p className="font-semibold text-slate-700">Stock Updates</p>
            <p className="text-sm text-slate-500">Create invoices to automatically update part stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;