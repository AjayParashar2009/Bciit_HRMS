import { React, useEffect, useState } from "react";

let baseUrl = import.meta.env.VITE_BASE_URL;
import axios from "axios";

export default function Dashboard() {
  let [empFormData, setEmpFormData] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/get/employee`)
      .then((res) => {
        const { success, message, data } = res.data;

        if (success) {
          setEmpFormData(data);
        }
      })
      .catch((err) => {
        const { success, message } = err.response.data;

        if (!success) {
          alert(message);
        }
      });
  }, []);

  let fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // console.log(fiveDaysAgo);

  let recent_employee = empFormData.filter((item) => {
    let emp_date = new Date(item.JoiningDate);
    return emp_date >= fiveDaysAgo;
  });

  // console.log(recent_employee);
  return (
    <>
      <main className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Welcome to HRMS Dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage employees, attendance, payroll, and HR workflows from one
                place.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
              Live overview
            </div>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Total Employees", value: empFormData.length },
            { title: "Pending Leave", value: "12" },
            { title: "Attendance Today", value: "220" },
            { title: "Payroll Due", value: "3" },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <h4 className="text-sm font-medium text-slate-500">
                {card.title}
              </h4>
              <p className="mt-4 text-3xl font-semibold text-slate-900">
                {card.value}
              </p>
            </div>
          ))}
        </section>
        <section className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Hires
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {recent_employee.map((item, key) => {
                return (
                  <li className="rounded-2xl bg-slate-50 px-4 py-3" key={key}>
                    {item.EmpName} - {item.Designation}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Urgent Actions
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl bg-slate-50 px-4 py-3">
                Approve leave requests
              </li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">
                Review attendance exceptions
              </li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">
                Finalize payroll report
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
