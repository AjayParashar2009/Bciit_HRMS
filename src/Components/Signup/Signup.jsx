import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Signup() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "", // Added username field
    password: "",
    confirmPassword: "",
    role: "employee", // Changed default from "admin" to "employee"
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidate = () => {
    const formError = {};

    if (!signupData.name?.trim()) {
      formError.name = "Name is required";
    }

    if (!signupData.email?.trim()) {
      formError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      formError.email = "Please enter a valid email address";
    }

    if (!signupData.username?.trim()) {
      formError.username = "Username is required";
    } else if (signupData.username.length < 3) {
      formError.username = "Username must be at least 3 characters";
    }

    if (!signupData.password) {
      formError.password = "Password is required";
    } else if (signupData.password.length < 6) {
      formError.password = "Password must be at least 6 characters";
    }

    if (!signupData.confirmPassword) {
      formError.confirmPassword = "Confirm Password is required";
    }

    if (
      signupData.password &&
      signupData.confirmPassword &&
      signupData.password !== signupData.confirmPassword
    ) {
      formError.confirmPassword = "Passwords do not match";
    }

    setError(formError);

    if (Object.keys(formError).length > 0) {
      return;
    }

    createAccount();
  };

  const createAccount = async () => {
    setLoading(true);

    const payload = {
      id: `user-${Date.now()}`,
      name: signupData.name.trim(),
      email: signupData.email.trim().toLowerCase(),
      username: signupData.username.trim().toLowerCase(),
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
      role: signupData.role || "employee",
    };

    try {
      const res = await axios.post(`${baseUrl}/api/signup`, payload);
      console.log("Signup Response:", res.data);

      const { success, message, token, user } = res.data;

      if (success) {
        alert(message || "Account created successfully");

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate based on role
        if (user?.role === "employee") {
          navigate("/employee");
        } else {
          navigate("/panel");
        }
      } else {
        alert(message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);

      let errorMessage = "Signup failed. Please try again.";
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
        if (err.response.status === 409) {
          errorMessage =
            "An account with this email or username already exists.";
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      }

      alert(errorMessage);
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
      <div className="w-112.5 p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={signupData.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              name="username"
              value={signupData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {error.username && (
              <p className="text-red-500 text-sm mt-1">{error.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password (min 6 characters)"
              name="password"
              value={signupData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            {error.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={signupData.role}
              onChange={handleChange}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <button
            type="button"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleValidate}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </div>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
