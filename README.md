# WatchedThis

A web application to keep track of the films you want to watch and the films you have already watched.

**Live demo:** https://clarabernadou.github.io/watchedthis/

> The demo is a static version: the API is simulated in the browser and the film information (titles, summaries, ratings, dates) is **fictional sample data that may be incorrect**. Posters and avatars are generated locally. Demo account: `demo` / `Demo1234`.

This repository is a snapshot of the version of **November 2023**.

## Features

- Account creation with e-mail verification, login by username, profile page (username, e-mail, profile picture)
- Catalogue of films stored in a database and filled from [TMDB](https://www.themoviedb.org/)
- Filter by genre tags, search, alphabetical sort
- Film page with release date, original language, overview and a star rating
- **Watchlist** ("Films to watch") and **Already watched** list with rating, comment and the place where the film was watched
- Seasonal theme (Halloween). A Christmas theme exists in the code but is currently disabled

## Tech stack

- **Frontend:** React 18 (Create React App), Redux Toolkit, React Router 6, Axios, js-cookie, Font Awesome
- **Backend:** Node.js, Express, Sequelize + MySQL, JWT (jsonwebtoken) and bcryptjs, Multer (profile picture upload), Nodemailer (Gmail), node-cron

## Repository layout

- `frontend/client/` — React application
- `backend/` — Express API
- `demo/` — fictional sample data and the in-browser API simulation used by the GitHub Pages demo
- `.github/workflows/deploy.yml` — builds the frontend and publishes the demo on GitHub Pages

## Run locally

### Backend

1. Create a MySQL database.
2. Copy `backend/.env.example` to `backend/.env` and fill in the values (TMDB API key, Gmail account and application password).
3. Create the two configuration files that are intentionally not committed (`backend/app/config/` is ignored by Git):
   - `db.config.js` exporting `HOST`, `USER`, `PASSWORD`, `DB`, `dialect` and `pool` (`max`, `min`, `acquire`, `idle`)
   - `auth.config.js` exporting `secret` (the key used to sign JSON Web Tokens)
4. `cd backend && npm install && node server.js` (the API listens on port 8080 by default).

### Frontend

1. Copy `frontend/client/.env.example` to `frontend/client/.env.development` and fill in the TMDB API key.
2. `cd frontend/client && npm install && npm start`.

## Security

Secrets (API keys, database credentials, JWT secret, mail credentials) live in `.env*` files and in `backend/app/config/`, which are ignored by Git. Never commit them.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.
