import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleValidate = () => {
    const formError = {};

    if (!loginData.email) {
      formError.email = "Email is required";
    }

    if (!loginData.password) {
      formError.password = "Password is required";
    }

    setError(formError);

    if (Object.keys(formError).length > 0) return;

    loginEmployee();
  };

  const loginEmployee = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/api/login`, loginData);

      console.log("Login Response:", res.data);

      const { success, message, token, role, email, id, user } = res.data;

      if (success) {
        // Store token and user data
        localStorage.setItem("token", token);

        // Store user data - use the user object if available, otherwise use individual fields
        const userData = user || { id, email, role };
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        if (role === "employee") {
          navigate("/employee");
        } else {
          navigate("/panel");
        }

        alert(message || "Login successful");
      } else {
        alert(message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        alert(err.response.data.message || "Login failed");
      } else if (err.request) {
        alert("No response from server. Please check your connection.");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[420px] bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Employee Login</h1>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
            className="w-full border rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
            className="w-full border rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}
        </div>

        <button
          onClick={handleValidate}
          disabled={loading}
          className="w-full h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
