import { useSelector } from "react-redux";

export default function Attendance() {
  let selector = useSelector((state) => state.employee.employeeData);
  console.log(selector);
  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Employee Attendance
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review daily attendance, exceptions, and shift status for your
              team.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
            Today&apos;s date: 2026-06-22
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">
            Total Employees
          </h4>
          <p className="mt-4 text-3xl font-semibold text-slate-900">248</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">Present</h4>
          <p className="mt-4 text-3xl font-semibold text-slate-900">220</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">Absent</h4>
          <p className="mt-4 text-3xl font-semibold text-slate-900">18</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">Late</h4>
          <p className="mt-4 text-3xl font-semibold text-slate-900">10</p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Attendance Records
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Search and filter attendance by status and employee details.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by name, id, or department"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:w-80"
            />
            <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>All</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Employee ID</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Check In</th>
                <th className="px-4 py-3 text-left font-medium">Check Out</th>
                <th className="px-4 py-3 text-left font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr>
                <td className="px-4 py-4 text-slate-700">E1001</td>
                <td className="px-4 py-4 text-slate-700">Riya Singh</td>
                <td className="px-4 py-4 text-slate-700">HR</td>
                <td className="px-4 py-4 text-slate-700">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Present
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">09:05</td>
                <td className="px-4 py-4 text-slate-700">17:30</td>
                <td className="px-4 py-4 text-slate-700">On time</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-700">E1002</td>
                <td className="px-4 py-4 text-slate-700">Akash Patel</td>
                <td className="px-4 py-4 text-slate-700">Engineering</td>
                <td className="px-4 py-4 text-slate-700">
                  <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    Absent
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">-</td>
                <td className="px-4 py-4 text-slate-700">-</td>
                <td className="px-4 py-4 text-slate-700">Sick leave</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-700">E1003</td>
                <td className="px-4 py-4 text-slate-700">Neha Sharma</td>
                <td className="px-4 py-4 text-slate-700">Finance</td>
                <td className="px-4 py-4 text-slate-700">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Present
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">08:55</td>
                <td className="px-4 py-4 text-slate-700">17:45</td>
                <td className="px-4 py-4 text-slate-700">Early arrival</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-700">E1004</td>
                <td className="px-4 py-4 text-slate-700">Rohan Verma</td>
                <td className="px-4 py-4 text-slate-700">Sales</td>
                <td className="px-4 py-4 text-slate-700">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Late
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">09:35</td>
                <td className="px-4 py-4 text-slate-700">18:00</td>
                <td className="px-4 py-4 text-slate-700">Traffic delay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
