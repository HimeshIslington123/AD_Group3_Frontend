import React from "react";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border border-border">
        
        <h2 className="text-2xl font-bold text-textMain mb-6 text-center">
          Create Account
        </h2>

        <form className="space-y-4">
          
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          />

          <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primaryLight transition">
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-textSecondary">
          Already have an account?{" "}
          <span className="text-primary cursor-pointer font-medium">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;