import { createSlice } from '@reduxjs/toolkit';

// Redux Slice (driverSlice.js)
const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    driverData: {}, // Set default to an empty object
  },
  reducers: {
    setDriverData: (state, action) => {
      state.driverData = action.payload;
    },
    updateDriverStatus: (state, action) => {
      state.driverData.registrationNumber = action.payload.registrationNumber;
      state.driverData.status = action.payload.status;
    },
  },
});

export const { setDriverData, updateDriverStatus } = driverSlice.actions;
export default driverSlice.reducer;
