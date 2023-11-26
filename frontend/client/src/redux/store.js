import { configureStore } from '@reduxjs/toolkit';
import filmReducer from './reducers/filmReducer';
import searchReducer from './reducers/searchReducer';
import sortReducer from './reducers/sortReducer';
import filmGenresReducer from './reducers/filmGenresReducer';
import selectTagsReducer from './reducers/selectTagsReducer';
import filmPageReducer from './reducers/filmPageReducer';
import userReducer from './reducers/userReducer';
import eventReducer from './reducers/eventReducer';

const store = configureStore({
  reducer: {
    film: filmReducer,
    filmGenres: filmGenresReducer,
    search: searchReducer,
    sort: sortReducer,
    selectTags: selectTagsReducer,
    filmPage: filmPageReducer,
    user: userReducer,
    event: eventReducer,
  },
});

export { store };
