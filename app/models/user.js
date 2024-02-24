const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    firebaseUserUUID: {
      type: Sequelize.STRING,
      unique: true,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    meta: {
      type: Sequelize.JSON
    }
  });
  return User;
};
