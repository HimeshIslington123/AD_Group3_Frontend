import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Truck,
  UserCheck,
  Package,
  AlertTriangle,
  CreditCard,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Boxes,
  ShieldCheck,
  FileBarChart2,
  Sparkles,
  CircleDollarSign,
  Warehouse,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PART_API = "http://localhost:5216/api/parts";
const VENDOR_API = "http://localhost:5216/api/vendor";
const CUSTOMER_API = "http://localhost:5216/api/customer";
const STAFF_API = "http://localhost:5216/api/staff";
const REPORT_API = "http://localhost:5216/api/financial-report/yearly";

// ─── Tiny helpers ────────────────────────────────────────────────────────────
const fmt = (n) =>
  typeof n === "number" ? `Rs ${n.toLocaleString("en-IN")}` : n;

const pct = (val, total) =>
  total ? Math.min(100, Math.round((val / total) * 100)) : 0;

// ─── Sub-components ──────────────────────────────────────────────────────────

const Pill = ({ label, ok }) => (
  <span
    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
      ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
    }`}
  >
    {ok ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
    {label}
  </span>
);

const StatCard = ({ title, value, icon: Icon, accent, sub, trend }) => (
  <div
    className="group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
  >
    {/* subtle background glow */}
    <div
      className={`absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl ${accent.bg}`}
    />

    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
          {title}
        </p>
        <h2 className="text-3xl font-black text-slate-800 mt-1 leading-none">
          {value}
        </h2>
        {sub && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            {sub}
          </p>
        )}
        {trend && (
          <div className="mt-3">
            <Pill label={trend.label} ok={trend.ok} />
          </div>
        )}
      </div>

      <div
        className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center
                    ${accent.bg} group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={24} className={accent.text} strokeWidth={1.8} />
      </div>
    </div>
  </div>
);

const InsightRow = ({ icon: Icon, color, bg, label, value }) => (
  <div
    className={`flex items-center justify-between p-4 rounded-xl ${bg} group`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white shadow-sm`}>
        <Icon size={16} className={color} />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
    <span className={`text-sm font-black ${color}`}>{value}</span>
  </div>
);

const ActionCard = ({ icon: Icon, title, desc, accent, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-full text-left p-5 rounded-2xl border border-transparent
                ${accent.bg} hover:border-current hover:shadow-md
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300`}
  >
    <div
      className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4
                   group-hover:scale-110 transition-transform duration-200`}
    >
      <Icon size={20} className={accent.text} strokeWidth={1.8} />
    </div>
    <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>
    <div
      className={`mt-3 flex items-center gap-1 text-xs font-semibold ${accent.text}`}
    >
      Open <ChevronRight size={13} />
    </div>
  </button>
);

const MiniBar = ({ value, max, color }) => (
  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full ${color} transition-all duration-700`}
      style={{ width: `${pct(value, max)}%` }}
    />
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStock: 0,
    totalSales: 0,
    inventoryValue: 0,
  });
 const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [partsRes, vendorsRes, customersRes, staffRes, salesRes] =
        await Promise.all([
          axios.get(PART_API, { headers }),
          axios.get(VENDOR_API, { headers }),
          axios.get(CUSTOMER_API, { headers }),
          axios.get(STAFF_API, { headers }),
          axios.get(REPORT_API, { headers }),
        ]);

      const parts = partsRes.data || [];
      const vendors = vendorsRes.data || [];
      const customers = customersRes.data || [];
      const staffs = staffRes.data || [];
      const sales = salesRes.data || [];

      const totalSales = sales.reduce((s, i) => s + i.totalRevenue, 0);
      const inventoryValue = parts.reduce(
        (s, i) => s + i.price * i.stockQuantity,
        0,
      );
      const lowStock = parts.filter((p) => p.stockQuantity < 10).length;

      setStats({
        totalStaff: staffs.length,
        totalVendors: vendors.length,
        totalCustomers: customers.length,
        totalProducts: parts.length,
        lowStock,
        totalSales,
        inventoryValue,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ── Card definitions ────────────────────────────────────────────────────────
  const cards = [
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: Users,
      accent: { bg: "bg-blue-50", text: "text-blue-600" },
      trend: { label: "Active", ok: true },
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: Truck,
      accent: { bg: "bg-emerald-50", text: "text-emerald-600" },
      trend: { label: "Registered", ok: true },
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: UserCheck,
      accent: { bg: "bg-violet-50", text: "text-violet-600" },
      trend: { label: "Growing", ok: true },
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      accent: { bg: "bg-indigo-50", text: "text-indigo-600" },
      trend: { label: "Listed", ok: true },
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: AlertTriangle,
      accent: { bg: "bg-amber-50", text: "text-amber-600" },
      trend: { label: "Needs attention", ok: false },
    },
    {
      title: "Total Sales",
      value: fmt(stats.totalSales),
      icon: CircleDollarSign,
      accent: { bg: "bg-teal-50", text: "text-teal-600" },
      trend: { label: "Revenue", ok: true },
    },
    {
      title: "Inventory Value",
      value: fmt(stats.inventoryValue),
      icon: Warehouse,
      accent: { bg: "bg-rose-50", text: "text-rose-600" },
      trend: { label: "Total assets", ok: true },
    },
  ];
const quickActions = [
    {
      icon: Boxes,
      title: "Manage Inventory",
      desc: "Add, update or remove parts & stock",
      accent: { bg: "bg-blue-50", text: "text-blue-600" },
      path: "/admin/inventorymanagement",
    },
    {
      icon: Truck,
      title: "Vendors",
      desc: "Manage vendor relationships",
      accent: { bg: "bg-emerald-50", text: "text-emerald-600" },
      path: "/admin/vendormanagement",
    },
    {
      icon: ShieldCheck,
      title: "Staff Management",
      desc: "Create and manage staff roles",
      accent: { bg: "bg-violet-50", text: "text-violet-600" },
      path: "/admin/staffmanagement",
    },
    {
      icon: FileBarChart2,
      title: "Reports",
      desc: "Financial & customer analytics",
      accent: { bg: "bg-amber-50", text: "text-amber-600" },
      path: "/admin/report",
    },
  ];

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <div>
            <p className="text-slate-700 font-semibold">Loading dashboard</p>
            <p className="text-slate-400 text-sm mt-0.5">
              Fetching latest data…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
        {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {lastUpdated
                ? `Last updated · ${lastUpdated.toLocaleTimeString()}`
                : "Complete business overview & analytics"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
          

            {/* Refresh */}
            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm
                         text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing ? "animate-spin text-blue-500" : "text-slate-500"
                }
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>

          

           
          </div>
        </div>

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <StatCard key={i} {...c} />
          ))}
        </div>

        {/* ── INSIGHTS + OVERVIEW ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Business Insights */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" />
                Business Insights
              </h2>
              <span className="text-xs text-slate-400">FY overview</span>
            </div>

            <div className="space-y-3">
              <InsightRow
                icon={Warehouse}
                color="text-blue-600"
                bg="bg-blue-50"
                label="Total Inventory Value"
                value={fmt(stats.inventoryValue)}
              />
              <InsightRow
                icon={CircleDollarSign}
                color="text-emerald-600"
                bg="bg-emerald-50"
                label="Overall Business Revenue"
                value={fmt(stats.totalSales)}
              />
              <InsightRow
                icon={AlertTriangle}
                color="text-amber-600"
                bg="bg-amber-50"
                label="Products Below Stock Limit"
                value={stats.lowStock}
              />
            </div>

            {/* mini revenue vs inventory bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Revenue vs Inventory ratio
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-20">Revenue</span>
                <MiniBar
                  value={stats.totalSales}
                  max={Math.max(stats.totalSales, stats.inventoryValue)}
                  color="bg-emerald-400"
                />
                <span className="text-xs font-bold text-emerald-600 w-12 text-right">
                  {pct(
                    stats.totalSales,
                    stats.totalSales + stats.inventoryValue,
                  )}
                  %
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-slate-500 w-20">Inventory</span>
                <MiniBar
                  value={stats.inventoryValue}
                  max={Math.max(stats.totalSales, stats.inventoryValue)}
                  color="bg-blue-400"
                />
                <span className="text-xs font-bold text-blue-600 w-12 text-right">
                  {pct(
                    stats.inventoryValue,
                    stats.totalSales + stats.inventoryValue,
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-violet-500" />
                System Overview
              </h2>
              <span className="text-xs text-slate-400">All entities</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: UserCheck,
                  label: "Total Customers",
                  value: stats.totalCustomers,
                  color: "text-violet-600",
                  bar: "bg-violet-400",
                  max: Math.max(
                    stats.totalCustomers,
                    stats.totalStaff,
                    stats.totalVendors,
                    stats.totalProducts,
                  ),
                },
                {
                  icon: Users,
                  label: "Staff Members",
                  value: stats.totalStaff,
                  color: "text-blue-600",
                  bar: "bg-blue-400",
                  max: Math.max(
                    stats.totalCustomers,
                    stats.totalStaff,
                    stats.totalVendors,
                    stats.totalProducts,
                  ),
                },
                {
                  icon: Truck,
                  label: "Total Vendors",
                  value: stats.totalVendors,
                  color: "text-emerald-600",
                  bar: "bg-emerald-400",
                  max: Math.max(
                    stats.totalCustomers,
                    stats.totalStaff,
                    stats.totalVendors,
                    stats.totalProducts,
                  ),
                },
                {
                  icon: Package,
                  label: "Total Products",
                  value: stats.totalProducts,
                  color: "text-indigo-600",
                  bar: "bg-indigo-400",
                  max: Math.max(
                    stats.totalCustomers,
                    stats.totalStaff,
                    stats.totalVendors,
                    stats.totalProducts,
                  ),
                },
              ].map(({ icon: Icon, label, value, color, bar, max }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl bg-slate-50 flex items-center gap-4"
                >
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                    <Icon size={15} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600">
                        {label}
                      </span>
                      <span className={`text-xs font-black ${color}`}>
                        {value}
                      </span>
                    </div>
                    <MiniBar value={value} max={max} color={bar} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
 {/* ── QUICK ACTIONS ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            Quick Actions
          </h2>

          <span className="text-xs text-slate-400">Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <ActionCard
              key={i}
              {...a}
              onClick={() => navigate(a.path)}
            />
          ))}
        </div>
      </div>

        {/* ── ALERT BANNER (if low stock) ─────────────────────────────────── */}
        {stats.lowStock > 0 && (
          <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-800 text-sm">
                Stock Alert — {stats.lowStock}{" "}
                {stats.lowStock === 1 ? "product" : "products"} running low
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                These items have fewer than 10 units in stock. Reorder soon to
                avoid stockouts.
              </p>
            </div>
          <button
  onClick={() => navigate("/admin/vendormanagement")}
  className="flex-shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition"
>
  View all <ChevronRight size={13} />
</button>
          </div>
        )}

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-slate-400 pb-2">
          © {new Date().getFullYear()} Admin Panel · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
