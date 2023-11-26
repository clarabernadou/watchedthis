import { createSlice } from '@reduxjs/toolkit';

const sortSlice = createSlice({
  name: 'sort',
  initialState: {
    sortValue: 'Alphabetical order (a-z)',
  },
  reducers: {
    setSortValue: (state, action) => {
      state.sortValue = action.payload;
    },
  },
});

export const { setSortValue } = sortSlice.actions;

export default sortSlice.reducer;
