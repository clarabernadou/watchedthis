const express = require("express");
const cors = require("cors");
const axios = require("axios");
const db = require("./app/models");
const app = express();
const path = require('path');
const CronJob = require("node-cron");

const Role = db.role;
const User = db.user;

require('dotenv').config();
const apiKey = process.env.TMDB_API_KEY;

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('client', express.static(path.join(__dirname, 'client')));

const updateDatabaseFromTMDb = async () => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: apiKey,
        language: "en-EN",
        page: 1
      },
    });

    const filmsFromAPI = response.data.results;

    for (const film of filmsFromAPI) {
      const existingFilm = await db.films.findOne({ where: { id: film.id } });

      if (!existingFilm) {
        await db.films.create({
          id: film.id,
          adult: film.adult,
          backdrop_path: film.backdrop_path,
          genre_ids: JSON.stringify(film.genre_ids),
          original_language: film.original_language,
          original_title: film.original_title,
          overview: film.overview,
          popularity: film.popularity,
          poster_path: film.poster_path,
          release_date: film.release_date,
          title: film.title,
          video: film.video,
          vote_average: film.vote_average,
          vote_count: film.vote_count,
        });
      }
    }

    const unverifiedUsers = await User.findAll({
      where: {
        is_verified: false,
      },
    });

    for (const user of unverifiedUsers) {
      await user.destroy();
      console.log(`User deleted: ${user.id}`);
    }

    console.log("Database updated with TMDb data and unverified user cleanup completed");
  } catch (error) {
    console.error("Failed to update the database with TMDb data or cleanup unverified users: " + error.message);
  }
};

CronJob.schedule("0 0 * * *", updateDatabaseFromTMDb); // Daily task scheduled for midnight (00:00)

require("./app/routes/film.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;

db.sequelize.sync({ force: false, alter: true })
  .then(async () => {
    console.log("Database synchronized with the Sequelize model.");
    await initial();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Database synchronization failed : " + err.message);
  });

async function initial() {
  try {
    await Role.findOrCreate({ where: { id: 1 }, defaults: { name: "user" } });
    await Role.findOrCreate({ where: { id: 2 }, defaults: { name: "moderator" } });
    await Role.findOrCreate({ where: { id: 3 }, defaults: { name: "admin" } });
  } catch (error) {
    console.error("Failed to initialize roles: " + error.message);
  }
}