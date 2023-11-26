module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        profilePicture: {
            type: Sequelize.STRING,
        },
        authentication_token: {
            type: Sequelize.STRING,
        },
        verification_token: {
            type: Sequelize.STRING,
        },
        is_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
  
    return User;
};
  