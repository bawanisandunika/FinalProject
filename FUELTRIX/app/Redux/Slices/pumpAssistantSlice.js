import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  securityCode: '',
  firstName: '',
  lastName: '',
  email: '',
};

const pumpAssistantSlice = createSlice({
  name: 'pumpAssistant',
  initialState,
  reducers: {
    setPumpAssistant(state, action) {
      state.securityCode = action.payload.securityCode;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
    },
    clearPumpAssistant(state) {
      state.securityCode = '';
      state.firstName = '';
      state.lastName = '';
      state.email = '';
    },
  },
});

export const { setPumpAssistant, clearPumpAssistant } = pumpAssistantSlice.actions;

export default pumpAssistantSlice.reducer;
