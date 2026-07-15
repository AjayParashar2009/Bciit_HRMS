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

      const { message, token, role, email, id } = res.data;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          email,
          role,
        }),
      );

      if (role === "employee") {
        navigate("/employee");
      } else {
        navigate("/panel");
      }

      alert(message);
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[420px] bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Employee Login</h1>

        <div className="mb-4">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            className="w-full border rounded-md h-10 px-3"
          />

          {error.email && <p className="text-red-500">{error.email}</p>}
        </div>

        <div className="mb-4">
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full border rounded-md h-10 px-3"
          />

          {error.password && <p className="text-red-500">{error.password}</p>}
        </div>

        <button
          onClick={handleValidate}
          disabled={loading}
          className="w-full h-10 bg-indigo-600 text-white rounded-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <Link to="/signup" className="text-indigo-600">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
