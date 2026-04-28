import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5216/api/auth/register",
        {
          fullName,
          email,
          password
        }
      );

      console.log(response.data);
      alert("Registered successfully");

    } catch (error) {
      console.error(error);

   
      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border border-border">
        
        <h2 className="text-2xl font-bold text-textMain mb-6 text-center">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border border-border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-border rounded-lg"
          />

          <button className="w-full bg-primary text-white py-3 rounded-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
