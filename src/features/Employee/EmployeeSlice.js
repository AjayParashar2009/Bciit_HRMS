import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  employeeData: [],
};

let employeeSlice = createSlice({
  name: "employee",
  initialState,

  reducers: {
    setEmployeeData: (state, action) => {
      state.employeeData = action.payload;
    },
  },
});

export const { setEmployeeData } = employeeSlice.actions;

export default employeeSlice.reducer;
