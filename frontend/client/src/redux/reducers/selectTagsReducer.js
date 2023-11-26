import { createSlice } from '@reduxjs/toolkit';

const selectTagsSlice = createSlice({
  name: 'selectTags',
  initialState: {
    selectTagsValue: [],
  },
  reducers: {
    setSelectTagsValue: (state, action) => {
      state.selectTagsValue = action.payload;
    },
    removeTag: (state, action) => {
      state.selectTagsValue.splice(state.selectTagsValue.findIndex((tag) => tag.id === action.payload), 1);
    },
  },
});


export const { setSelectTagsValue, removeTag } = selectTagsSlice.actions;

export default selectTagsSlice.reducer;