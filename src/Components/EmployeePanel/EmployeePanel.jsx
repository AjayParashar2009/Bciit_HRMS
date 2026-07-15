import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EmployeePanel() {
  let employees = useSelector((state) => state.employee.employeeData) || [];
  let navigate = useNavigate();

  let menu = [
    { label: "Dashboard", path: "/employee" },
    { label: "My Profile", path: "/employee/my-profile" },
    { label: "My Attendance", path: "/employee/my-attendance" },
    { label: "Payslips", path: "/employee/payslip" },
    { label: "Requests", path: "/employee/requests" },
    { label: "Settings", path: "/employee/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="flex flex-col gap-4 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-600 px-4 py-2 text-white shadow-sm">
            <span className="text-lg font-semibold">Employee Panel</span>
          </div>
          <div className="text-sm text-slate-600">Welcome back</div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search colleagues..."
            className="w-60 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-2 shadow-sm">
            <span className="text-sm font-medium">You</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              E
            </div>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-base font-semibold text-slate-900">Menu</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {menu.map((m) => (
              <li
                key={m.path}
                className="rounded-2xl px-4 py-3 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                onClick={() => navigate(m.path)}
              >
                {m.label}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-4 text-sm text-slate-600">
            <h4 className="mb-2 font-medium text-slate-800">Colleagues</h4>
            <ul className="space-y-2">
              {employees.slice(0, 6).map((emp) => (
                <li key={emp._id} className="flex items-center gap-3">
                  <div className="h-8 w-8 flex-none rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    {emp.empName ? emp.empName.charAt(0) : "?"}
                  </div>
                  <div className="truncate text-sm">{emp.empName}</div>
                </li>
              ))}
              {employees.length === 0 && (
                <li className="text-xs">No colleagues found</li>
              )}
            </ul>
          </div>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
