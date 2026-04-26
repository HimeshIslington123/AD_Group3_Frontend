import React from "react";

const Home = () => {
  return (
    <div className="font-sans bg-gray-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">AutoPart Pro</h1>

        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-600">Products</a>
          <a href="#" className="hover:text-blue-600">Services</a>
          <a href="#" className="hover:text-blue-600">Solutions</a>
        </div>

        <input
          type="text"
          placeholder="Search inventory, parts, or SKU..."
          className="hidden md:block border rounded-full px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-gray-100">🔔</button>
          <button className="p-2 rounded-full bg-gray-100">⚙️</button>
          <div className="w-9 h-9 bg-blue-500 rounded-full"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-[500px] flex items-center justify-start text-white px-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 p-8 rounded-xl max-w-xl">
          <p className="text-blue-300 font-semibold mb-2">
            NEW PERFORMANCE SERIES 2024
          </p>
          <h1 className="text-4xl font-bold mb-4">
            Precision Parts for Peak Performance
          </h1>
          <p className="text-sm text-gray-200 mb-6">
            Streamline your inventory with AutoPart Pro. A scalable logistics
            and supply chain solution for modern dealerships and professional
            workshops.
          </p>

          <div className="flex gap-3">
            <button className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
              Browse Parts
            </button>
            <button className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-200">
              View Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-10 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Categories</h2>
          <a href="#" className="text-blue-600 font-medium">
            View All Categories →
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e"
              className="h-40 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="font-bold text-lg">Engine Components</h3>
              <p className="text-gray-500 text-sm mt-2">
                Pistons, valves, and fuel injectors engineered for performance.
              </p>
              <span className="text-xs text-blue-600 mt-3 inline-block">
                ENGINE
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f"
              className="h-40 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="font-bold text-lg">Braking Systems</h3>
              <p className="text-gray-500 text-sm mt-2">
                Precision-calibrated braking systems for safety.
              </p>
              <span className="text-xs text-red-600 mt-3 inline-block">
                SAFETY
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
              className="h-40 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="font-bold text-lg">Lighting & Vision</h3>
              <p className="text-gray-500 text-sm mt-2">
                Advanced LED optics and visibility enhancement systems.
              </p>
              <span className="text-xs text-yellow-600 mt-3 inline-block">
                SMART TECH
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="px-10 py-16 bg-white">
        <h2 className="text-2xl font-bold mb-8">Trusted by Industry Experts</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              name: "Marcus Sterling",
              role: "Service Director",
              text: "Inventory tracking precision is unmatched. Reduced ordering time by 40%.",
            },
            {
              name: "Sarah Jenkins",
              role: "Parts Manager",
              text: "Dashboard is intuitive and powerful. Everything is streamlined.",
            },
            {
              name: "David Chen",
              role: "Owner",
              text: "Support team is excellent and system is very reliable.",
            },
          ].map((t, i) => (
            <div key={i} className="p-6 border rounded-xl bg-gray-50">
              <div className="text-yellow-400 mb-3">★★★★★</div>
              <p className="text-gray-600 text-sm mb-4">"{t.text}"</p>
              <h4 className="font-bold">{t.name}</h4>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-10 py-12">
        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-white font-bold text-lg mb-3">AutoPart Pro</h3>
            <p className="text-sm">
              Inventory management system for modern automotive businesses.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <p>Dashboard</p>
            <p>Parts Inventory</p>
            <p>Order Tracking</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <p>Help Center</p>
            <p>API Docs</p>
            <p>Report Issue</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Newsletter</h4>
            <input
              placeholder="Your email"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            />
            <button className="mt-3 w-full bg-blue-600 py-2 rounded">
              Subscribe
            </button>
          </div>

        </div>

        <p className="text-center text-xs mt-10 text-gray-500">
          © 2026 AutoPart Pro. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default Home;