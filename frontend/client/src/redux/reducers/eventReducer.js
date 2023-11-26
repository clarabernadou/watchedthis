import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    eventName: null,
    colorBtn: "buttonsColor",
  },
  reducers: {
    setEvent: (state, action) => {
      state.eventName = action.payload;
    },
    setColorBtn: (state, action) => {
      state.colorBtn = action.payload
    }
  },
});

export const { setEvent, setColorBtn } = eventSlice.actions;

export default eventSlice.reducer;
