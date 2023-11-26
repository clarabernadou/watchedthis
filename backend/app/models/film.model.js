module.exports = (sequelize, Sequelize) => {
    const Film = sequelize.define("film", {
      adult: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      backdrop_path: {
        type: Sequelize.STRING
      },
      genre_ids: {
        type: Sequelize.JSON
      },
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      original_language: {
        type: Sequelize.STRING
      },
      original_title: {
        type: Sequelize.STRING
      },
      overview: {
        type: Sequelize.TEXT
      },
      popularity: {
        type: Sequelize.DECIMAL(10, 2)
      },
      poster_path: {
        type: Sequelize.STRING
      },
      release_date: {
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.BOOLEAN,
      },
      vote_average: {
        type: Sequelize.DECIMAL(4, 2)
      },
      vote_count: {
        type: Sequelize.INTEGER
      }
    });
  
    return Film;
  };  