import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    resetUserInfo: (state) => {
      state.user = null;
    },
  },
});

export const { setUserInfo, resetUserInfo } = userSlice.actions;

export default userSlice.reducer;
