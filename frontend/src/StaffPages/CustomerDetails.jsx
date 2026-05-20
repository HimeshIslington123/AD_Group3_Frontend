import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5216/api/customer";

/* =========================================================
   AVATAR
========================================================= */

const Avatar = ({ name }) => {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const color =
    colors[name?.charCodeAt(0) % colors.length] ||
    colors[0];

  return (
    <div
      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${color}`}
    >
      {initials}
    </div>
  );
};

/* =========================================================
   BADGE
========================================================= */

const Badge = ({
  children,
  variant = "gray",
}) => {
  const variants = {
    gray: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
    amber:
      "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-600",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  icon,
  message,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
    <span className="text-4xl mb-2">
      {icon}
    </span>

    <p className="text-sm">{message}</p>
  </div>
);

/* =========================================================
   SECTION CARD
========================================================= */

const SectionCard = ({
  title,
  badge,
  children,
}) => (
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b">
      <h3 className="font-bold text-slate-700">
        {title}
      </h3>

      <Badge variant="blue">
        {badge}
      </Badge>
    </div>

    <div className="p-6">{children}</div>
  </div>
);

/* =========================================================
   SORT OPTIONS
========================================================= */

const SORT_OPTIONS = [
  {
    value: "az",
    label: "A → Z",
  },
  {
    value: "za",
    label: "Z → A",
  },
  {
    value: "mostVehicles",
    label: "Most Vehicles",
  },
  {
    value: "leastVehicles",
    label: "Least Vehicles",
  },
];

/* =========================================================
   MAIN
========================================================= */

const CustomerDetails = () => {
  const [customers, setCustomers] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState("az");

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("service");

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response =
        await axios.get(API);

      const formatted =
        response.data.map((c) => ({
          id: c.id,

          name:
            c.fullName || "Unknown",

          phone: c.phone || "—",

          address:
            c.address || "—",

          email: c.email || "—",

          vehicles:
            c.vehicles?.map((v) => ({
              id: v.id,

              model:
                v.model || "Unknown",

              brand:
                v.brand || "",

              number:
                v.vehicleNumber || "",

              year: v.year,

              type: v.type,
            })) || [],

          serviceHistory:
            c.appointments?.map((a) => ({
              id: a.id,

              item: `Appointment #${a.id}`,

              date: a.date,

              status:
                a.status || "Pending",
            })) || [],

          purchaseHistory:
            c.salesInvoices?.map((s) => ({
              id: s.id,

              item:
                s.description ||
                `Invoice #${s.id}`,

              date: s.date,

              cost: s.amount || 0,
            })) || [],

          partRequests:
            c.partRequests?.map((p) => ({
              id: p.id,

              urgency:
                p.urgency || "Normal",

              status:
                p.status || "Pending",

              paymentStatus:
                p.paymentStatus ||
                "Unpaid",

              date: p.date,

              vehicleNumber:
                p.vehicle
                  ?.vehicleNumber ||
                c.vehicles?.[0]
                  ?.vehicleNumber ||
                "N/A",

              items:
                p.items?.map((i) => ({
                  id: i.id,

                  partName:
                    i.partName ||
                    i.part?.name ||
                    "Unknown Part",

                  quantity:
                    i.quantity || 0,

                  price:
                    i.price || 0,

                  subTotal:
                    i.subTotal ||
                    i.price *
                      i.quantity ||
                    0,
                })) || [],
            })) || [],
        }));

      setCustomers(formatted);

      if (formatted.length > 0) {
        setSelected(formatted[0]);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredAndSorted =
    useMemo(() => {
      let list = customers.filter(
        (c) => {
          const searchValue =
            search.toLowerCase();

          const vehicleMatch =
            c.vehicles?.some((v) =>
              v.number
                ?.toLowerCase()
                .includes(searchValue)
            );

          return (
            c.name
              .toLowerCase()
              .includes(searchValue) ||
            c.phone.includes(search) ||
            c.email
              .toLowerCase()
              .includes(searchValue) ||
            vehicleMatch
          );
        }
      );

      switch (sort) {
        case "az":
          list.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;

        case "za":
          list.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
          break;

        case "mostVehicles":
          list.sort(
            (a, b) =>
              b.vehicles.length -
              a.vehicles.length
          );
          break;

        case "leastVehicles":
          list.sort(
            (a, b) =>
              a.vehicles.length -
              b.vehicles.length
          );
          break;

        default:
          break;
      }

      return list;
    }, [customers, search, sort]);

  /* =========================================================
     TOTAL SAVED
  ========================================================= */

  const totalSaved =
    selected?.partRequests?.reduce(
      (acc, request) => {
        const total =
          request.items.reduce(
            (sum, item) =>
              sum + item.subTotal,
            0
          );

        if (total > 5000) {
          return acc + total * 0.1;
        }

        return acc;
      },
      0
    ) || 0;

  /* =========================================================
     TOTAL SPEND
  ========================================================= */

  const totalSpend =
    selected?.partRequests?.reduce(
      (acc, request) => {
        const total =
          request.items.reduce(
            (sum, item) =>
              sum + item.subTotal,
            0
          );

        const discount =
          total > 5000
            ? total * 0.1
            : 0;

        return (
          acc + (total - discount)
        );
      },
      0
    ) || 0;

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!selected) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        No customers found
      </div>
    );
  }

  /* =========================================================
     TABS
  ========================================================= */

  const tabs = [
    {
      key: "service",
      label: "Services",
      count:
        selected.serviceHistory
          ?.length || 0,
    },

    {
      key: "purchase",
      label: "Purchases",
      count:
        selected.purchaseHistory
          ?.length || 0,
    },

    {
      key: "parts",
      label: "Part Requests",
      count:
        selected.partRequests
          ?.length || 0,
    },
  ];

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-4xl font-black text-slate-800">
            Customers
          </h1>

          <p className="text-slate-500 mt-2">
            {
              customers.length
            } total customers
          </p>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">

          {/* LEFT */}

          <div className="space-y-4">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search customer, email, phone, vehicle number..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-white outline-none"
            />

            {/* SORT */}

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-white outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                >
                  {o.label}
                </option>
              ))}
            </select>

            {/* CUSTOMER LIST */}

            <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">

              {filteredAndSorted.map(
                (customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelected(
                        customer
                      );

                      setActiveTab(
                        "service"
                      );
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition border-b last:border-b-0 ${
                      selected?.id ===
                      customer.id
                        ? "bg-blue-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <Avatar
                      name={
                        customer.name
                      }
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">
                        {
                          customer.name
                        }
                      </p>

                      <p className="text-sm text-slate-500 truncate">
                        {
                          customer.phone
                        }
                      </p>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-5">

            {/* PROFILE */}

            <div className="bg-white rounded-3xl border shadow-sm p-6">

              <h2 className="text-3xl font-black text-slate-800">
                {selected.name}
              </h2>

              <div className="mt-4 space-y-2">

                <p className="text-slate-500">
                  📞 {selected.phone}
                </p>

                <p className="text-slate-500">
                  📧 {selected.email}
                </p>

                <p className="text-slate-500">
                  📍 {selected.address}
                </p>

              </div>

              {/* STATS */}

              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">
                    {
                      selected
                        .vehicles
                        .length
                    }
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Vehicles
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">
                    {
                      selected
                        .serviceHistory
                        .length
                    }
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Services
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">
                    {
                      selected
                        .partRequests
                        .length
                    }
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Requests
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-xl font-black text-emerald-600">
                    Rs.
                    {totalSaved.toLocaleString()}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Saved
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-xl font-black text-blue-600">
                    Rs.
                    {totalSpend.toLocaleString()}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Total Spend
                  </p>
                </div>

              </div>
            </div>

            {/* VEHICLES */}

            <SectionCard
              title="Vehicles"
              badge={
                selected.vehicles
                  .length
              }
            >
              {selected.vehicles
                .length === 0 ? (
                <EmptyState
                  icon="🚗"
                  message="No vehicles"
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {selected.vehicles.map(
                    (v) => (
                      <div
                        key={v.id}
                        className="p-5 rounded-2xl border bg-slate-50"
                      >
                        <p className="font-bold text-lg">
                          {v.brand}{" "}
                          {v.model}
                        </p>

                        <p className="text-slate-500 mt-1">
                          {v.number}
                        </p>

                        <p className="text-sm text-slate-400 mt-2">
                          {v.type} •{" "}
                          {v.year}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </SectionCard>

            {/* TABS */}

            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

              {/* TAB HEADER */}

              <div className="flex border-b">

                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() =>
                      setActiveTab(
                        tab.key
                      )
                    }
                    className={`flex-1 py-4 text-sm font-bold transition ${
                      activeTab ===
                      tab.key
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500"
                    }`}
                  >
                    {tab.label} (
                    {tab.count})
                  </button>
                ))}

              </div>

              {/* CONTENT */}

              <div className="p-6">

                {/* SERVICES */}

                {activeTab ===
                  "service" && (
                  <>
                    {selected
                      .serviceHistory
                      .length ===
                    0 ? (
                      <EmptyState
                        icon="🔧"
                        message="No service history"
                      />
                    ) : (
                      <div className="space-y-4">
                        {selected.serviceHistory.map(
                          (
                            service
                          ) => (
                            <div
                              key={
                                service.id
                              }
                              className="border rounded-2xl p-4 bg-slate-50 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-bold">
                                  {
                                    service.item
                                  }
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  {new Date(
                                    service.date
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <Badge
                                variant={
                                  service.status ===
                                  "Completed"
                                    ? "green"
                                    : "amber"
                                }
                              >
                                {
                                  service.status
                                }
                              </Badge>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* PURCHASE */}

                {activeTab ===
                  "purchase" && (
                  <>
                    {selected
                      .purchaseHistory
                      .length ===
                    0 ? (
                      <EmptyState
                        icon="🧾"
                        message="No purchases"
                      />
                    ) : (
                      <div className="space-y-4">
                        {selected.purchaseHistory.map(
                          (
                            purchase
                          ) => (
                            <div
                              key={
                                purchase.id
                              }
                              className="border rounded-2xl p-4 bg-slate-50 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-bold">
                                  {
                                    purchase.item
                                  }
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  {new Date(
                                    purchase.date
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <p className="font-black text-blue-600">
                                Rs.
                                {
                                  purchase.cost
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* PARTS */}

                {activeTab ===
                  "parts" && (
                  <>
                    {selected
                      .partRequests
                      .length ===
                    0 ? (
                      <EmptyState
                        icon="🛠️"
                        message="No part requests"
                      />
                    ) : (
                      <div className="space-y-5">

                        {selected.partRequests.map(
                          (
                            request
                          ) => {
                            const total =
                              request.items.reduce(
                                (
                                  sum,
                                  item
                                ) =>
                                  sum +
                                  item.subTotal,
                                0
                              );

                            const hasDiscount =
                              total >
                              5000;

                            const discount =
                              hasDiscount
                                ? total *
                                  0.1
                                : 0;

                            const finalTotal =
                              total -
                              discount;

                            return (
                              <div
                                key={
                                  request.id
                                }
                                className="border rounded-3xl overflow-hidden bg-white"
                              >

                                {/* HEADER */}

                                <div className="bg-slate-50 border-b px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                  <div>
                                    <p className="font-black text-lg">
                                      Request #
                                      {
                                        request.id
                                      }
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                      {new Date(
                                        request.date
                                      ).toLocaleString()}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-2">
                                      Vehicle:
                                      {" "}
                                      <span className="font-semibold">
                                        {
                                          request.vehicleNumber
                                        }
                                      </span>
                                    </p>
                                  </div>

                                  <div className="flex gap-2 flex-wrap">

                                    <Badge
                                      variant={
                                        request.status ===
                                        "Delivered"
                                          ? "green"
                                          : "amber"
                                      }
                                    >
                                      {
                                        request.status
                                      }
                                    </Badge>

                                    <Badge
                                      variant={
                                        request.paymentStatus ===
                                        "Paid"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {
                                        request.paymentStatus
                                      }
                                    </Badge>

                                    <Badge
                                      variant={
                                        request.urgency ===
                                        "High"
                                          ? "red"
                                          : "blue"
                                      }
                                    >
                                      {
                                        request.urgency
                                      }
                                    </Badge>

                                  </div>
                                </div>

                                {/* ITEMS */}

                                <div className="p-5 space-y-4">

                                  {request.items.map(
                                    (
                                      item
                                    ) => (
                                      <div
                                        key={
                                          item.id
                                        }
                                        className="border rounded-2xl p-4 bg-slate-50"
                                      >

                                        <div className="flex justify-between">

                                          <div>

                                            <p className="font-bold text-slate-800">
                                              {
                                                item.partName
                                              }
                                            </p>

                                            <p className="text-sm text-slate-500 mt-2">
                                              Qty:
                                              {" "}
                                              {
                                                item.quantity
                                              }
                                            </p>

                                            <p className="text-sm text-slate-500">
                                              Price:
                                              {" "}
                                              Rs{" "}
                                              {
                                                item.price
                                              }
                                            </p>

                                          </div>

                                          <div className="text-right">

                                            <p className="font-black text-lg">
                                              Rs{" "}
                                              {
                                                item.subTotal
                                              }
                                            </p>

                                            <p className="text-xs text-slate-400">
                                              Subtotal
                                            </p>

                                          </div>

                                        </div>
                                      </div>
                                    )
                                  )}

                                  {/* DISCOUNT */}

                                  {hasDiscount && (
                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4">

                                      <p className="font-bold text-green-700">
                                        Loyalty
                                        Discount
                                        Applied
                                      </p>

                                      <p className="text-sm text-green-600 mt-1">
                                        You
                                        received
                                        10%
                                        discount
                                        because
                                        your
                                        purchase
                                        exceeded
                                        Rs 5000.
                                      </p>

                                      <p className="mt-3 text-sm font-bold text-green-700">
                                        Discount:
                                        {" "}
                                        Rs{" "}
                                        {
                                          discount
                                        }
                                      </p>

                                    </div>
                                  )}

                                  {/* TOTALS */}

                                  <div className="border-t pt-5 space-y-3">

                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">
                                        Original
                                        Total
                                      </span>

                                      <span className="font-bold">
                                        Rs{" "}
                                        {
                                          total
                                        }
                                      </span>
                                    </div>

                                    {hasDiscount && (
                                      <div className="flex justify-between text-sm text-green-600">
                                        <span>
                                          Discount
                                          (10%)
                                        </span>

                                        <span>
                                          - Rs{" "}
                                          {
                                            discount
                                          }
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex justify-between border-t pt-3 text-xl font-black">

                                      <span>
                                        Final
                                        Total
                                      </span>

                                      <span className="text-green-600">
                                        Rs{" "}
                                        {
                                          finalTotal
                                        }
                                      </span>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}

                      </div>
                    )}
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;