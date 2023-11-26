const auth = require("../middleware/index")

module.exports = app => {
  const filmController = require("../controllers/film.controller.js");
  var router = require("express").Router();

  router.post("/add", filmController.addFilmsFromAPI);
  router.get("/", auth.authJwt.verifyToken, filmController.getAllFilms);
  router.get("/:id", auth.authJwt.verifyToken, filmController.getOneFilm);
  router.put('/update/:id', auth.authJwt.verifyToken, filmController.updateFilm);

  router.post("/auth/:userId/film/:filmId/add-to-watchlist", filmController.addToWatchlist);
  router.post("/auth/:userId/film/:filmId/add-to-already-watched", filmController.addToAlreadyWatched);
  router.put("/auth/:userId/film/:filmId/update/userFilm", filmController.updateFilmUserData);
  // router.post("/auth/:userId/film/:filmId/add-comment", filmController.addComment);
  router.get("/auth/:userId/film/:filmId/status", filmController.getFilmStatus);
  router.get("/auth/:userId/save-films/", filmController.getAllUserFilm);

  app.use('/api/films', router);
}
