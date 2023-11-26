import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './app.css';

import FilmPage from './Pages/FilmPage';
import HomePage from './Pages/HomePage';
import NotFoundPage from './Pages/NotFoundPage';
import HalloweenPage from './Themes/Halloween/HalloweenPage';
import ChristmasPage from './Themes/Christmas/ChristmasPage';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';
import ProfilePage from './Pages/ProfilePage';
import VerificationPage from './Pages/VerificationPage';
import WatchlistPage from './Pages/WatchlistPage';
import AlreadyWatchedPage from './Pages/AlreadyWatchedPage';

import isThemeActive from './Themes/isThemeActive';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!Cookies.get('authentication_token')) {
      Cookies.remove('userInfoCookie');
      Cookies.remove('user_id');
    }

    const userInfoJSON = Cookies.get('userInfoCookie');
    if (userInfoJSON) {
      const userInfo = JSON.parse(userInfoJSON);
      setUserInfo(userInfo);
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/profile" element={<ProfilePage userInfo={userInfo} />} />
          <Route path="/films" element={<HomePage />} />
          <Route path="/film/:id" element={<FilmPage />} />
          <Route path="/my-watchlist" element={<WatchlistPage />} />
          <Route path="/my-already-watched" element={<AlreadyWatchedPage />} />

          {isThemeActive(10, 30, 11, 1) ? (
            <Route path="/event/halloween" element={<HalloweenPage />} />
          ) : null}

          {/* {isThemeActive(12, 1, 12, 31) ? (
            <Route path="/event/christmas" element={<Christmas />} />
          ) : null} */}

          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" />} />

          <Route path="/verify-account/:token" element={<VerificationPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
