const { Sequelize, DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const userPlaylists = sequelize.define("userPlaylists", {
    songName: {
        type: Sequelize.STRING,
        required: true,
    },
    songArtist1: {
        type: Sequelize.STRING,
    },
    songArtist2: {
        type: Sequelize.STRING,
    },
    songArtist3: {
        type: Sequelize.STRING,
    },
    songGenre: {
        type: Sequelize.STRING,
    }
  },  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'songName']
      }
    ]
    });

  return userPlaylists;
};