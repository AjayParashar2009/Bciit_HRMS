import { configureStore } from "@reduxjs/toolkit";

import employeeReducer from "./features/Employee/EmployeeSlice";

let store = configureStore({
  reducer: {
    employee: employeeReducer,
  },
});


export default store;
