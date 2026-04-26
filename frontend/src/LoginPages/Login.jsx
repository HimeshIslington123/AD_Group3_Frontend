import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent reload

    console.log("Email:", email);
    console.log("Password:", password);

    // 👉 later: connect backend here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border border-border">
        
        <h2 className="text-2xl font-bold text-textMain mb-6 text-center">
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="text-sm text-textSecondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm text-textSecondary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primaryLight transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-textSecondary">
          Don’t have an account?{" "}
          <span className="text-primary cursor-pointer font-medium">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;