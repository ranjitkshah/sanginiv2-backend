const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER
    },
    profession: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    isCameraVerified: {
      type: Sequelize.STRING
    }
  });


  return User;
};
