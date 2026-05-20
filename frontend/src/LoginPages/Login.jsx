import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LOGIN_API = "http://localhost:5216/api/auth/login";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Login failed");
        return;
      }

      // SAVE
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      setSuccess("Login successful!");

      console.log("TOKEN:", data.token);
      console.log("ROLE:", data.role);

      // ROLE NAVIGATION
      if (data.role === "Admin") {
        navigate("/admin");
      } else if (data.role === "Staff") {
        navigate("/staff");
      } else if (data.role === "Customer") {
        navigate("/user");
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/carss.jpeg')",
      }}
      className="min-h-screen flex bg-no-repeat bg-cover bg-center items-center justify-center bg-gray-50 p-6"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-1">
          Welcome Back
        </h2>

        <p className="text-gray-500 mb-6">
          Login to your account
        </p>

        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded w-full"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border p-2 rounded w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 cursor-pointer font-medium"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;