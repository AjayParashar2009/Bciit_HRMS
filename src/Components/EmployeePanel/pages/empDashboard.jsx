import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [employees] = useState([]);
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Employee Dashboard</h2>

        <p className="text-gray-500 mt-2">
          Personal overview and quick actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-3xl p-6 shadow">
          <h4>Team Size</h4>
          <p className="text-3xl font-bold mt-3">{employees.length}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h4>Leaves Pending</h4>
          <p className="text-3xl font-bold mt-3">0</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h4>Attendance Today</h4>
          <p className="text-3xl font-bold mt-3">---</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h4>Next Pay</h4>
          <p className="text-3xl font-bold mt-3">--</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Colleagues</h3>

          {employees.length === 0 ? (
            <p>No colleagues found.</p>
          ) : (
            employees.map((emp) => (
              <div key={emp._id} className="bg-slate-100 rounded-lg p-3 mb-2">
                {emp.empName}
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>

          <button
            onClick={() => navigate("/employee/panel/myprofile")}
            className="block w-full mb-3 bg-slate-100 rounded-lg p-3 text-left"
          >
            View Profile
          </button>

          <button
            onClick={() => navigate("/employee/panel/myattendance")}
            className="block w-full mb-3 bg-slate-100 rounded-lg p-3 text-left"
          >
            My Attendance
          </button>

          <button
            onClick={() => navigate("/employee/panel/requests")}
            className="block w-full bg-slate-100 rounded-lg p-3 text-left"
          >
            Request Leave
          </button>
        </div>
      </div>
    </section>
  );
}
