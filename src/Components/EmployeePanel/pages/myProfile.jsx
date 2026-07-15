import React, { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function MyProfile() {
  // Get logged in user
  let storedUser = {};

  try {
    const userItem = localStorage.getItem("user");
    if (userItem && userItem !== "undefined") {
      storedUser = JSON.parse(userItem);
    }
  } catch (error) {
    console.log(error);
  }

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    empImage: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  // Fetch logged in employee
  const getProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get/employee`);

      const employee = res.data.data.find(
        (emp) => String(emp.EmpId) === String(storedUser.id),
      );
      if (employee) {
        setUser({
          name: employee.EmpName,
          email: employee.Email,
          phone: employee.ContactNumber,
          department: employee.EmpDepartment,
          role: employee.Designation,
          empImage: employee.empImage,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Upload profile image
  const updateProfileImg = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("empImage", image);
      formData.append("Email", user.email);

      const res = await axios.put(`${baseUrl}/api/update/byemail`, formData);

      if (res.data.success) {
        alert("Profile image updated successfully");
        getProfile(); // Reload latest image
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-indigo-100 mt-1">Personal Information</p>
        </div>

        <div className="p-6 md:flex gap-8">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={
                user.empImage
                  ? `${baseUrl}/employeeProfile/${user.empImage}`
                  : "https://via.placeholder.com/150"
              }
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
            />

            <label className="mt-4 cursor-pointer rounded-md border border-indigo-200 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50">
              Update Profile Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            <button
              onClick={updateProfileImg}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Upload Image
            </button>

            <h2 className="mt-5 text-xl font-semibold">{user.name}</h2>

            <p className="text-gray-500">{user.role}</p>
          </div>

          <div className="flex-1 mt-6 md:mt-0 grid gap-4 sm:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Phone</p>
              <p>{user.phone}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Department</p>
              <p>{user.department}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Designation</p>
              <p>{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
