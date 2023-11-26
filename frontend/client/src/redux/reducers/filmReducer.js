import { createSlice } from '@reduxjs/toolkit';

const filmSlice = createSlice({
  name: 'film',
  initialState: {
    films: [],
    filteredFilms: [],
    filmsStatus: [],
  },
  reducers: {
    setFilms: (state, action) => {
      state.films = action.payload;
    },
    setFilteredFilms: (state, action) => {
      state.filteredFilms = action.payload
    },
    setFilmsStatus: (state, action) => {
      state.filmsStatus = action.payload
    }
  },
});

export const { setFilms, setFilteredFilms, setFilmsStatus } = filmSlice.actions;

export default filmSlice.reducer;
