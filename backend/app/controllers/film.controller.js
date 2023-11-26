const axios = require("axios");
const db = require("../models");
const Film = db.films;
const User = db.user;

exports.addFilmsFromAPI = async (req, res) => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: "ecf4f1c78c7cc335bec6cd2e784b0b18",
        language: "en-EN",
      },
    });

    const filmsFromAPI = response.data.results;

    for (const film of filmsFromAPI) {
      const existingFilm = await Film.findOne({ where: { id: film.id } });

      if (!existingFilm) {
        await Film.create({
          adult: film.adult,
          backdrop_path: film.backdrop_path,
          genre_ids: JSON.stringify(film.genre_ids),
          id: film.id,
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

    res.json({ message: "Films added to the database" });
  } catch (err) {
    console.error("Error retrieving movies from TMDB API: " + err.message);
    res.status(500).json({ error: "Error while retrieving films" });
  }
};

exports.getAllFilms = (req, res) => {
  Film.findAll()
    .then((films) => {
      res.json(films);
    })
    .catch((err) => {
      console.error("Error retrieving films: " + err.message);
      res.status(500).json({ error: "Error while retrieving films" });
    });
};

exports.getOneFilm = (req, res) => {
  const filmId = req.params.id;

  Film.findByPk(filmId)
    .then((film) => {
      if (!film) {
        return res.status(404).json({ error: "Film not found" });
      }
      res.json(film);
    })
    .catch((err) => {
      console.error("Error retrieving the film: " + err.message);
      res.status(500).json({ error: "Error while retrieving the film" });
    });
};

exports.updateFilm = (req, res) => {
  const filmId = req.params.id;
  const { add_to_watchlist, already_watched } = req.body;

  const userId = req.user.id;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.addFilm(filmId, {
        through: { add_to_watchlist, already_watched },
      });

      res.json({ message: "Film updated successfully" });
    })
    .catch((err) => {
      console.error("Error updating the user film relation: " + err.message);
      res.status(500).json({ error: "Error while updating the user film relation" });
    });
};

const UserFilm = db.userFilm;

exports.addToWatchlist = async (req, res) => {
  const { filmId, userId } = req.params;

  try {
    let userFilm = await UserFilm.findOne({ where: { filmId, userId } });

    if (!userFilm) {
      userFilm = await UserFilm.create({ filmId, userId });
      userFilm.toWatch = true;
      await userFilm.save();
      return res.status(200).json({ message: 'Film added to watchlist successfully' });
    }

    userFilm.toWatch = !userFilm.toWatch;
    await userFilm.save();

    if (userFilm.toWatch) {
      return res.status(200).json({ message: 'Film added to watchlist successfully' });
    } else {
      return res.status(200).json({ message: 'Film removed from watchlist successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the film status' });
  }
};

exports.addToAlreadyWatched = async (req, res) => {
  const { filmId, userId } = req.params;

  try {
    let userFilm = await UserFilm.findOne({ where: { filmId, userId } });

    if (!userFilm) {
      userFilm = await UserFilm.create({ filmId, userId });
      userFilm.alreadyWatched = true;
      await userFilm.save();
      return res.status(200).json({ message: 'Film marked as already watched successfully' });
    }

    userFilm.alreadyWatched = !userFilm.alreadyWatched;
    await userFilm.save();

    if (userFilm.alreadyWatched) {
      return res.status(200).json({ message: 'Film marked as already watched successfully' });
    } else {
      return res.status(200).json({ message: 'Film marked as not watched successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the film status' });
  }
};

exports.updateFilmUserData = async (req, res) => {
  const { filmId, userId } = req.params;
  const { comment, notation, place, withList } = req.body;

  try {
    let userFilm = await UserFilm.findOne({ where: { filmId, userId } });

    if (!userFilm) {
      return res.status(404).json({ error: "UserFilm association not found" });
    }

    if (typeof comment !== null) {
      userFilm.comment = comment;
    }

    if (typeof notation !== null) {
      if (notation === 0) {
        userFilm.notation = null;
      } else {
        userFilm.notation = notation;
      }
    }

    if (typeof place !== null) {
      userFilm.place = place;
    }

    if (typeof withList !== null) {
      userFilm.with = withList;
    }

    await userFilm.save();

    return res.status(200).json({ message: "Film data updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating film data', details: error.message });
  }
};


exports.getFilmStatus = async (req, res) => {
  const { filmId, userId } = req.params;

  try {
    const userFilm = await UserFilm.findOne({
      where: { filmId, userId },
    });

    if (!userFilm) {
      return res.status(200).json({
        filmId: null,
        toWatch: false,
        alreadyWatched: false,
        notation: null,
        comment: null,
        place: null, 
        with: null
      });
    } else {
      return res.status(200).json({
        filmId: userFilm.filmId,
        toWatch: userFilm.toWatch,
        alreadyWatched: userFilm.alreadyWatched,
        notation: userFilm.notation,
        comment: userFilm.comment,
        place: userFilm.place,
        with: userFilm.with
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching film status' });
  }
};

exports.getAllUserFilm = async (req, res) => {
  try {
    const allUserFilms = await UserFilm.findAll();
    return res.status(200).json(allUserFilms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching all user films' });
  }
};