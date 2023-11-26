import { createSlice } from '@reduxjs/toolkit';

const filmGenresSlice = createSlice({
  name: 'filmGenres',
  initialState: {
    filmGenres: [],
  },
  reducers: {
    setFilmGenres: (state, action) => {
      state.filmGenres = action.payload;
    },
  },
});

export const { setFilmGenres } = filmGenresSlice.actions;

export default filmGenresSlice.reducer;