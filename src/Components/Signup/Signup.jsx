import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Signup() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
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
    }

    if (!signupData.password) {
      formError.password = "Password is required";
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
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
      role: signupData.role || "admin",
    };

    try {
      const res = await axios.post(`${baseUrl}/api/signup`, payload);
      const { success, message, token } = res.data;

      if (success) {
        alert(message || "Account created successfully");
        localStorage.setItem("token", token);
        navigate("/panel");
      }
    } catch (err) {
      const responseMessage = err.response?.data?.message || "Signup failed";
      alert(responseMessage);
      console.error(err.response || err);
    } finally {
      setLoading(false);
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
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500"
              onChange={handleChange}
            />
            <p className="text-red-500 text-sm">{error.name}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={signupData.email}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500"
              onChange={handleChange}
            />
            <p className="text-red-500 text-sm">{error.email}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={signupData.password}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500"
              onChange={handleChange}
            />
            <p className="text-red-500 text-sm">{error.password}</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={signupData.confirmPassword}
              className="w-full h-10 px-3 border border-gray-300 rounded-md outline-none focus:border-indigo-500"
              onChange={handleChange}
            />
            <p className="text-red-500 text-sm">{error.confirmPassword}</p>
          </div>

          <button
            type="button"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
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
