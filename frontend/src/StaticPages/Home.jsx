import React from "react";

const Home = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-800">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">AutoPartsPro</h1>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#">Home</a>
          <a href="#">Shop</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-1 border rounded-lg">Login</button>
          <button className="px-4 py-1 bg-blue-600 text-white rounded-lg">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative text-center py-24 px-6 bg-gray-100">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs tracking-widest text-gray-500 mb-3">
            NEW PERFORMANCE SERIES 2024
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            QUALITY VEHICLE PARTS,
            <br />
            DELIVERED FAST
          </h1>

          <p className="text-gray-600 mt-4 text-sm">
            AutoPartsPro offers a wide range of genuine automotive parts
            for all vehicle types and brands.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Explore Parts
            </button>
            <button className="border px-6 py-2 rounded-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-10 text-center">
        <p className="text-xs text-gray-500 mb-2">HOW IT WORKS</p>
        <h2 className="text-2xl font-bold mb-10">
          Get your vehicle back on the road in three simple steps
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "1. Register Account", desc: "Create your account easily." },
            { title: "2. Find Your Parts", desc: "Search from wide inventory." },
            { title: "3. Get Delivered", desc: "Fast and secure delivery." },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-blue-600 text-xl mb-2">⚙️</div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-10 py-16 bg-white">
        <div className="flex justify-between mb-8">
          <h2 className="text-xl font-bold">
            Top quality components for peak performance
          </h2>
          <a className="text-blue-600 text-sm">View All Products →</a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              name: "Premium Brake Disc",
              price: "$24.99",
              img: "https://images.unsplash.com/photo-1581093458791-9f3c3900dfc9",
            },
            {
              name: "High Performance Air Filter",
              price: "$19.99",
              img: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f",
            },
            {
              name: "Professional Oil Filter",
              price: "$12.99",
              img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
            },
          ].map((p, i) => (
            <div key={i} className="border rounded-xl p-4 hover:shadow-md">
              <img
                src={p.img}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-blue-600 mt-2">{p.price}</p>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 border rounded py-1 text-sm">
                  Details
                </button>
                <button className="flex-1 bg-blue-600 text-white rounded py-1 text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-10 text-center">
        <h2 className="text-xl font-bold mb-10">
          The best parts, the best service.
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: "20K+", desc: "Happy Customers" },
            { title: "10K+", desc: "Parts Available" },
            { title: "24/7", desc: "Customer Support" },
            { title: "Fast", desc: "Delivery Service" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-2xl font-bold text-blue-600">
                {stat.title}
              </h3>
              <p className="text-sm text-gray-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-16 px-6">
        <h2 className="text-2xl font-bold mb-3">
          Ready to keep your vehicle running?
        </h2>
        <p className="text-sm mb-6">
          Join thousands of customers who trust us for their vehicle parts needs.
        </p>

        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg">
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-10 py-12 text-sm">
        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-white font-bold mb-3">AutoPartsPro</h3>
            <p>Quality automotive parts for every vehicle.</p>
          </div>

          <div>
            <h4 className="text-white mb-3">Quick Links</h4>
            <p>Home</p>
            <p>Shop</p>
            <p>Contact</p>
          </div>

          <div>
            <h4 className="text-white mb-3">Support</h4>
            <p>Help Center</p>
            <p>Privacy Policy</p>
          </div>

          <div>
            <h4 className="text-white mb-3">Newsletter</h4>
            <input
              className="w-full px-3 py-2 rounded bg-gray-800 mb-2"
              placeholder="Email"
            />
            <button className="bg-blue-600 w-full py-2 rounded">
              Subscribe
            </button>
          </div>

        </div>

        <p className="text-center text-xs mt-10">
          © 2026 AutoPartsPro. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default Home;