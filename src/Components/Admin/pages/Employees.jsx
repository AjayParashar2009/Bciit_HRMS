import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import axios from "axios";

let baseUrl = import.meta.env.VITE_BASE_URL;

function Employees() {
  let [empData, setEmpData] = useState({});
  let [error, setError] = useState({});
  let [openModal, setOpenModal] = useState(false);
  let [openEditModal, setOpenEditModal] = useState(false);
  let [openAccountModal, setOpenAccountModal] = useState(false);
  let [empFormData, setEmpFormData] = useState([]);
  let [filterData, setFilterData] = useState([]);
  let [editData, setEditData] = useState({});
  let [accountData, setAccountData] = useState({});
  let [selectedEmployee, setSelectedEmployee] = useState(null);
  let [confirmPassword, setConfirmPassword] = useState("");

  let handleChange = (e) => {
    let { name, value } = e.target;
    setEmpData({ ...empData, [name]: value });
  };

  let handleAccountChange = (e) => {
    let { name, value } = e.target;
    setEmpData({ ...empData, account: { ...empData.account, [name]: value } });
  };

  // Handle account creation form change
  let handleAccountFormChange = (e) => {
    let { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setAccountData({ ...accountData, [name]: value });
    }
  };

  let handleValidate = (empData) => {
    let empErrors = {};

    if (!empData.EmpId) {
      empErrors.EmpId = "Employee ID is required.";
    }
    if (!empData.EmpName) {
      empErrors.EmpName = "Employee Name is required.";
    }
    if (!empData.Gender) {
      empErrors.Gender = "Gender is required.";
    }
    if (!empData.DOB) {
      empErrors.DOB = "Employee Date of Birth is mandatory.";
    }
    if (!empData.Email) {
      empErrors.Email = "Email is required.";
    }
    if (!empData.ContactNumber) {
      empErrors.ContactNumber = "Employee Phone Number is required.";
    } else if (empData.ContactNumber.length !== 10) {
      empErrors.ContactNumber = "Employee Phone Number must be of 10 digits.";
    }
    if (!empData.EmpDepartment) {
      empErrors.EmpDepartment = "Employee Department is required.";
    }
    if (!empData.Salary) {
      empErrors.Salary = "Please fill your current salary.";
    } else if (empData.Salary < 5000) {
      empErrors.Salary = "Invalid Salary";
    }
    if (!empData.JoiningDate) {
      empErrors.JoiningDate = "Employee Joining date is required.";
    }
    if (!empData.Designation) {
      empErrors.Designation = "Employee Designation is required.";
    }

    // Account validation
    if (empData.account) {
      if (!empData.account.username) {
        empErrors.username = "Username is required for account creation.";
      }
      if (!empData.account.password) {
        empErrors.password = "Password is required for account creation.";
      } else if (empData.account.password.length < 6) {
        empErrors.password = "Password must be at least 6 characters.";
      }
      if (!empData.account.role) {
        empErrors.role = "Role is required for account creation.";
      }
      if (empData.account.password !== empData.account.confirmPassword) {
        empErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setError(empErrors);
    return Object.keys(empErrors).length;
  };

  // Validate account creation form
  let validateAccountForm = (data, confirmPwd) => {
    let errors = {};

    if (!data.username) {
      errors.username = "Username is required.";
    }

    if (!data.password) {
      errors.password = "Password is required.";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!data.role) {
      errors.role = "Role is required.";
    }

    if (!data.email) {
      errors.email = "Email is required.";
    }

    // Check if password and confirm password match
    if (data.password && confirmPwd && data.password !== confirmPwd) {
      errors.confirmPassword = "Passwords do not match.";
    }

    // Also check if confirm password is empty
    if (!confirmPwd) {
      errors.confirmPassword = "Please confirm your password.";
    }

    return errors;
  };

  let handleSubmit = () => {
    let validate = handleValidate(empData);

    if (validate === 0) {
      let submitData = { ...empData };

      // If account data exists, include it in the payload
      if (empData.account && empData.account.username) {
        submitData.hasAccount = true;
        submitData.account = {
          username: empData.account.username,
          password: empData.account.password,
          role: empData.account.role,
          email: empData.Email,
        };
        // Remove the account from the root level to avoid duplication
        delete submitData.account;
      }

      axios
        .post(`${baseUrl}/api/post/employee`, submitData) // ✅ Changed to correct endpoint
        .then((res) => {
          let { success, message } = res.data;
          if (success) {
            alert(message);
            setOpenModal(false);
            setEmpData({});
            setError({});
            fetchEmployees();
          } else {
            alert("Failed: " + message);
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          let errorMsg = err.response?.data?.message || "An error occurred";
          alert(errorMsg);
        });
    }
  };

  // Handle create account for existing employee
  let handleCreateAccount = () => {
    // Validate the account form with confirmPassword
    let errors = validateAccountForm(accountData, confirmPassword);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    // Clear any previous errors
    setError({});

    // Make sure we have the correct field names from the employee data
    let employeeId =
      selectedEmployee.EmpId || selectedEmployee.id || selectedEmployee._id;

    if (!employeeId) {
      alert("Employee ID is missing. Please try again.");
      return;
    }

    let accountPayload = {
      EmpId: employeeId, // ✅ Changed from 'id' to 'EmpId'
      username: accountData.username,
      password: accountData.password,
      confirmPassword: confirmPassword,
      role: accountData.role,
      email: accountData.email || selectedEmployee.Email,
    };

    console.log("Sending payload:", accountPayload);

    axios;
    axios
      .post(`${baseUrl}/api/signup`, {
        id: accountPayload.EmpId,
        name: accountPayload.username,
        email: accountPayload.email,
        password: accountPayload.password,
        confirmPassword: accountPayload.confirmPassword,
        role: accountPayload.role,
      })
      .then((res) => {
        let { success, message } = res.data;
        if (success) {
          alert(message || "Account created successfully!");
          setOpenAccountModal(false);
          setAccountData({});
          setSelectedEmployee(null);
          setConfirmPassword("");
          setError({});
          fetchEmployees();
        } else {
          alert("Account creation failed: " + (message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.log("Error:", err);
        let errorMessage = "Account creation failed: ";
        if (err.response) {
          if (err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
          } else if (err.response.status === 409) {
            errorMessage += "An account already exists for this employee.";
          } else if (err.response.status === 404) {
            errorMessage += "Employee not found. Please try again.";
          } else {
            errorMessage +=
              "Server error (Status: " + err.response.status + ")";
          }
        } else if (err.request) {
          errorMessage +=
            "No response from server. Please check your connection.";
        } else {
          errorMessage += err.message || "Unknown error occurred";
        }
        alert(errorMessage);
      });
  };

  let fetchEmployees = () => {
    axios
      .get(`${baseUrl}/api/get/employee`)
      .then((res) => {
        let { success, message, data } = res.data;
        if (success) {
          setEmpFormData(data);
        } else {
          console.error("Failed to fetch employees:", message);
        }
      })
      .catch((err) => {
        console.error(
          "Error fetching employees:",
          err.response?.data || err.message,
        );
      });
  };

  let handleEditChange = (e) => {
    let { name, value } = e.target;
    if (name.startsWith("account_")) {
      let accountField = name.replace("account_", "");
      setEditData({
        ...editData,
        account: { ...editData.account, [accountField]: value },
      });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  let handleEditClick = (item) => {
    setEditData(item);
    setFilterData([item]);
    setOpenEditModal(true);
  };

  let handleUpdateSubmit = () => {
    let id = editData._id;

    if (!id) {
      alert("Employee ID is missing");
      return;
    }

    axios
      .put(`${baseUrl}/api/update/byID/${id}`, editData) // ✅ Added 'api/'
      .then((res) => {
        let { success, message } = res.data;
        if (success) {
          alert(message);
          setOpenEditModal(false);
          setEditData({});
          setFilterData([]);
          fetchEmployees();
        }
      })
      .catch((err) => {
        let { success, message } = err.response.data;
        if (success === false) {
          alert(message);
        }
      });
  };

  let handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`${baseUrl}/api/delete/byID/${id}`) // ✅ Added 'api/'
        .then((res) => {
          let { success, message } = res.data;
          if (success) {
            alert(message);
            fetchEmployees();
          }
        })
        .catch((err) => {
          let { message } = err.response.data;
          alert(message);
        });
    }
  };

  // Open account creation modal
  let openAccountCreationModal = (employee) => {
    setSelectedEmployee(employee);
    setAccountData({
      username: employee.EmpName?.toLowerCase().replace(/\s/g, "") || "",
      email: employee.Email || "",
      role: "employee",
      password: "",
    });
    setConfirmPassword("");
    setOpenAccountModal(true);
    setError({});
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Employees</CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  Manage your employee records efficiently
                </CardDescription>
              </div>
              <CardAction>
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                  <DialogTrigger asChild>
                    <button className="bg-white text-blue-700 hover:bg-blue-50 transition-all duration-200 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg border-2 border-white cursor-pointer">
                      + Add Employee
                    </button>
                  </DialogTrigger>
                  <DialogContent className="p-6 max-w-2xl h-150 scroll-smooth overflow-auto rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                        ✨ New Employee Registration
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Fill in the details below to add a new employee to the
                        system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Employee ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your Employee ID"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="EmpId"
                          onChange={handleChange}
                        />
                        {error.EmpId && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.EmpId}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Employee Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your Name"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="EmpName"
                          onChange={handleChange}
                        />
                        {error.EmpName && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.EmpName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5 bg-white"
                          name="Gender"
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {error.Gender && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.Gender}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="Email"
                          onChange={handleChange}
                        />
                        {error.Email && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.Email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="ContactNumber"
                          onChange={handleChange}
                        />
                        {error.ContactNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.ContactNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="DOB"
                          onChange={handleChange}
                        />
                        {error.DOB && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.DOB}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Designation <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Employee designation"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="Designation"
                          onChange={handleChange}
                        />
                        {error.Designation && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.Designation}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Salary <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Enter your Salary"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="Salary"
                          onChange={handleChange}
                        />
                        {error.Salary && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.Salary}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Joining Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="JoiningDate"
                          onChange={handleChange}
                        />
                        {error.JoiningDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.JoiningDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 text-sm">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter department"
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                          name="EmpDepartment"
                          onChange={handleChange}
                        />
                        {error.EmpDepartment && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.EmpDepartment}
                          </p>
                        )}
                      </div>

                      {/* Account Creation Section */}
                      <div className="border-t-2 border-gray-200 pt-4 mt-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                          🔐 Create Employee Account (Optional)
                        </h3>
                        <div>
                          <label className="font-semibold text-gray-700 text-sm">
                            Username
                          </label>
                          <input
                            type="text"
                            placeholder="Enter username for login"
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                            name="username"
                            onChange={handleAccountChange}
                          />
                          {error.username && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.username}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 text-sm mt-3 block">
                            Password
                          </label>
                          <input
                            type="password"
                            placeholder="Enter a secure password"
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                            name="password"
                            onChange={handleAccountChange}
                          />
                          {error.password && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.password}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 text-sm mt-3 block">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                            name="confirmPassword"
                            onChange={handleAccountChange}
                          />
                          {error.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.confirmPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 text-sm mt-3 block">
                            Role
                          </label>
                          <select
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5 bg-white"
                            name="role"
                            onChange={handleAccountChange}
                          >
                            <option value="">Select Role</option>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                            <option value="hr">HR</option>
                          </select>
                          {error.role && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.role}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-100">
                        <button
                          className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                          onClick={() => {
                            setOpenModal(false);
                            setError({});
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                          onClick={handleSubmit}
                        >
                          Create Employee
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Emp ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DOB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {empFormData.map((item) => {
                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.EmpId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.EmpName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.Gender}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.DOB}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.Email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.ContactNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.EmpDepartment}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ₹{item.Salary}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.JoiningDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.Designation}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.hasAccount ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Has Account
                            </span>
                          ) : (
                            <button
                              className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors font-medium cursor-pointer"
                              onClick={() => openAccountCreationModal(item)}
                            >
                              + Create Account
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors font-medium cursor-pointer"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-medium cursor-pointer"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-600">
              Total Employees:{" "}
              <span className="font-semibold text-gray-800">
                {empFormData.length}
              </span>
            </p>
          </CardFooter>
        </Card>

        {/* Edit Employee Record Modal */}
        <Dialog
          open={openEditModal}
          onOpenChange={() => setOpenEditModal(false)}
        >
          <DialogContent className="p-6 max-w-2xl h-150 scroll-smooth overflow-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                ✏️ Edit Employee Details
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the employee information below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Employee ID"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="EmpId"
                  value={editData.EmpId || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="EmpName"
                  value={editData.EmpName || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5 bg-white"
                  name="Gender"
                  value={editData.Gender || ""}
                  onChange={handleEditChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="Email"
                  value={editData.Email || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="ContactNumber"
                  value={editData.ContactNumber || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="DOB"
                  value={editData.DOB || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Employee designation"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="Designation"
                  value={editData.Designation || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your Salary"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="Salary"
                  value={editData.Salary || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Joining Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="JoiningDate"
                  value={editData.JoiningDate || ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter department"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="EmpDepartment"
                  value={editData.EmpDepartment || ""}
                  onChange={handleEditChange}
                />
              </div>

              {/* Account Management Section */}
              {editData.hasAccount && (
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    🔐 Account Management
                  </h3>
                  <div>
                    <label className="font-semibold text-gray-700 text-sm">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                      name="account_username"
                      value={editData.account?.username || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 text-sm mt-3 block">
                      Password (leave empty to keep current)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password or leave blank"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                      name="account_password"
                      onChange={handleEditChange}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 text-sm mt-3 block">
                      Role
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5 bg-white"
                      name="account_role"
                      value={editData.account?.role || ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Role</option>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setOpenEditModal(false);
                    setEditData({});
                    setFilterData([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                  onClick={handleUpdateSubmit}
                >
                  Update Employee
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Account Modal */}
        <Dialog
          open={openAccountModal}
          onOpenChange={() => {
            setOpenAccountModal(false);
            setAccountData({});
            setSelectedEmployee(null);
            setConfirmPassword("");
            setError({});
          }}
        >
          <DialogContent className="p-6 max-w-md rounded-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                🔐 Create Account
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a login account for the employee.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Employee Name - Read Only */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed mt-1.5"
                  value={selectedEmployee?.EmpName || ""}
                  readOnly
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="email"
                  value={accountData.email || ""}
                  onChange={handleAccountFormChange}
                />
                {error.email && (
                  <p className="text-red-500 text-sm mt-1">{error.email}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="username"
                  value={accountData.username || ""}
                  onChange={handleAccountFormChange}
                />
                {error.username && (
                  <p className="text-red-500 text-sm mt-1">{error.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter a secure password (min 6 characters)"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="password"
                  value={accountData.password || ""}
                  onChange={handleAccountFormChange}
                />
                {error.password && (
                  <p className="text-red-500 text-sm mt-1">{error.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5"
                  name="confirmPassword"
                  value={confirmPassword || ""}
                  onChange={handleAccountFormChange}
                />
                {error.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.confirmPassword}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors mt-1.5 bg-white"
                  name="role"
                  value={accountData.role || ""}
                  onChange={handleAccountFormChange}
                >
                  <option value="">Select Role</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                </select>
                {error.role && (
                  <p className="text-red-500 text-sm mt-1">{error.role}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-100 sticky bottom-0 bg-white pb-2">
                <button
                  className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setOpenAccountModal(false);
                    setAccountData({});
                    setSelectedEmployee(null);
                    setConfirmPassword("");
                    setError({});
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                  onClick={handleCreateAccount}
                >
                  Create Account
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Employees;
