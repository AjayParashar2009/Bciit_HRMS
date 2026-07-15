import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../features/Employee/EmployeeSlice";
useDispatch;
let baseUrl = import.meta.env.VITE_BASE_URL;

export default function Panel() {
  const [empFormData, setEmpFormData] = useState([]);
  let dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/get/employee`)
      .then((res) => {
        let { success, message, data } = res.data;
        setEmployeeData(data);
        dispatch(setEmployeeData(data));
      })
      .catch((err) => {
        let { success, message } = err.response.data;
        console.log(message);
      });
  }, []);

  let navigate = useNavigate();
  let sideBar = [
    { label: "Dashboard", path: "/Panel/Dashboard" },
    { label: "Employees", path: "/panel/Employees" },
    { label: "Attendance", path: "/panel/Attendance" },
    { label: "Leave Request", path: "/panel/Leave/request" },
    { label: "Payroll", path: "/panel/Pay/request" },
    { label: "Performance", path: "/panel/Performance" },
    { label: "Reports", path: "/panel/Reports" },
    { label: "Settings", path: "/panel/Settings" },
  ];
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="flex flex-col gap-4 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-2xl bg-sky-600 px-4 py-3 text-white shadow-sm">
            <span className="text-lg font-semibold">HRMS Admin</span>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
            <button
              onClick={() => {
                navigate("/panel/Dashboard");
              }}
              className="rounded-full px-4 py-2 hover:bg-slate-100"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/Panel/Employees");
              }}
              className="rounded-full px-4 py-2 hover:bg-slate-100"
            >
              Employees
            </button>
            <button className="rounded-full px-4 py-2 hover:bg-slate-100">
              Attendance
            </button>
            <button className="rounded-full px-4 py-2 hover:bg-slate-100">
              Payroll
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 shadow-sm">
            <span className="text-sm font-medium">Admin</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white">
              <img
                className="rounded-2xl"
                src="https://i.pravatar.cc/40"
                alt="A"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-base font-semibold text-slate-900">
            HRMS Menu
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {sideBar.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl px-4 py-3 hover:bg-slate-50 hover:text-slate-900"
                onClick={() => {
                  navigate(`${item.path}`);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>
        <Outlet />
      </div>
    </div>
  );
}
