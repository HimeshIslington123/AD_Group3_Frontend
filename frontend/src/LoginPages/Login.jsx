import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:51391/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);

      // Fetch user info to get role
      const meResponse = await fetch("http://localhost:51391/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${data.token}`
        }
      });

      if (meResponse.ok) {
        const userData = await meResponse.json();
        const role = userData.role;
        localStorage.setItem("role", role);

        alert(`Login successful as ${role}`);

        if (role === "Admin") {
          navigate("/admin");
        } else if (role === "Staff") {
          navigate("/staff");
        } else {
          navigate("/user");
        }
      } else {
        alert("Login successful but failed to fetch user role");
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Make sure the backend is running.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <span 
            className="text-amber-600 cursor-pointer font-medium hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;