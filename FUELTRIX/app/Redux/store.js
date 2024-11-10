import { configureStore } from '@reduxjs/toolkit';
import driverReducer from './Slices/driverSlice';

const store = configureStore({
  reducer: {
    driver: driverReducer,
  },
});

export default store;
