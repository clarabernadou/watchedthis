module.exports = (sequelize, Sequelize) => {
    const UserFilm = sequelize.define("userFilm", {
        filmId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        toWatch: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        alreadyWatched: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        notation: {
            type: Sequelize.INTEGER,
            defaultValue: null,
        },
        comment: {
            type: Sequelize.TEXT,
            defaultValue: null
        },
        place: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        with: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    });
  
    return UserFilm;
};
