import { configureStore } from '@reduxjs/toolkit';
import driverReducer from './Slices/driverSlice'; // Adjust the path if necessary
import pumpAssistantReducer from './Slices/pumpAssistantSlice'; // Adjust the path if necessary

const store = configureStore({
  reducer: {
    driver: driverReducer,
    pumpAssistant: pumpAssistantReducer,
  },
});

export default store;
