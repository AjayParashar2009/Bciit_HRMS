import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./Components/Login/Login"));
const Signup = lazy(() => import("./Components/Signup/Signup"));
const Panel = lazy(() => import("./Components/Admin/panel"));
const Dashboard = lazy(() => import("./Components/Admin/Dashboard"));
const Employees = lazy(() => import("./Components/Admin/pages/Employees"));
const Attendance = lazy(() => import("./Components/Admin/pages/Attendance"));
const EmployeeDirectory = lazy(
  () => import("./Components/Admin/pages/EmployeeDirectory"),
);
const LeaveRequest = lazy(
  () => import("./Components/Admin/pages/LeaveRequest"),
);
const Payroll = lazy(() => import("./Components/Admin/pages/Payroll"));
const Performance = lazy(() => import("./Components/Admin/pages/Performance"));
const Report = lazy(() => import("./Components/Admin/pages/Report"));
const Settings = lazy(() => import("./Components/Admin/pages/Settings"));
const RequireAuth = lazy(() => import("./Components/RequireAuth"));

import EmployeePanel from "./Components/EmployeePanel/EmployeePanel";
import EmpDashboard from "./Components/EmployeePanel/pages/empDashboard";
import MyProfile from "./Components/EmployeePanel/pages/myProfile";
import MyAttendance from "./Components/EmployeePanel/pages/myAttendance";
import EmpPayslip from "./Components/EmployeePanel/pages/payslip";
import EmpRequests from "./Components/EmployeePanel/pages/requests";
import EmpSetting from "./Components/EmployeePanel/pages/setting";

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-300 border-t-sky-600"></div>

            <p className="mt-5 text-lg font-medium text-slate-700 animate-pulse">
              Loading...
            </p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/panel"
            element={
              <RequireAuth>
                <Panel />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="employee-directory" element={<EmployeeDirectory />} />
            <Route path="leave/request" element={<LeaveRequest />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="performance" element={<Performance />} />
            <Route path="report" element={<Report />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/employee" element={<EmployeePanel />}>
            <Route index element={<EmpDashboard />} />
            <Route path="dashboard" element={<EmpDashboard />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="my-attendance" element={<MyAttendance />} />
            <Route path="payslip" element={<EmpPayslip />} />
            <Route path="requests" element={<EmpRequests />} />
            <Route path="settings" element={<EmpSetting />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
