import { createSlice } from '@reduxjs/toolkit';

const filmPageSlice = createSlice({
  name: 'filmPage',
  initialState: {
    filmPage: [],
  },
  reducers: {
    setFilmPage: (state, action) => {
      state.filmPage = action.payload;
    },
  },
});

export const { setFilmPage } = filmPageSlice.actions;

export default filmPageSlice.reducer;
