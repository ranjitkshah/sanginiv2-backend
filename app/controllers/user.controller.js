const db = require("../models");
const User = db.users;
const userPlaylist = db.userPlaylists; 
const Track = db.tracks;
const FriendRequest = db.friendrequests;
const { sendJSONResponse, sendBadRequest } = require("../utils/handle")
const { getPagingData, getPagination } = require("../utils/paginate");

const Op = db.Sequelize.Op;



exports.createUser = async (req, res) => {
  try {
    const { firebaseUserUUID, phoneNumber, meta } = req.body;

    if (!firebaseUserUUID || !phoneNumber) {
      return sendBadRequest(res, 400, "Missing required user details.");
    }

    const newUser = await db.users.create({
      firebaseUserUUID,
      phoneNumber,
      meta
    });

    return sendJSONResponse(res, 201, "User created successfully", { user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return sendBadRequest(res, 409, "User with the provided details already exists.");
    }
    return sendBadRequest(res, 500, `Error while creating user: ${error.message}`);
  }
};



exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { meta } = req.body; 

    if (!meta) {
      return sendBadRequest(res, 400, "Meta data is required for update.");
    }

    const user = await db.users.findByPk(userId);

    if (!user) {
      return sendBadRequest(res, 404, "User not found.");
    }

    await user.update({ meta });

    return sendJSONResponse(res, 200, "User updated successfully", { user: user });
  } catch (error) {
    console.error("Error updating user:", error);
    return sendBadRequest(res, 500, `Error while updating user: ${error.message}`);
  }
};

 

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      }
    })
    if (!user) {
      return sendBadRequest(res, 404, "User Not Found");
    }
    return sendJSONResponse(res, 200, "User exists", {
      user
    })
  }
  catch (err) {
    return sendBadRequest(res, 500, `${err.message}`)
  }
};



exports.createPlaylist = async (req, res) => {
  try {
    const userId = req.params.id; 

    const user = await User.findOne({ where: { id: userId }})

    if (!user) {
      return sendBadRequest(res, 404, "User Not Found");
    }
    
    const { playlistData } = req.body;

    if (!playlistData || !Array.isArray(playlistData)) {
      return sendBadRequest(res, 400, "Invalid playlist data");
    }

    if(playlistData.length < 10) {
      return sendBadRequest(res, 400, "Please add more than 10 songs");
    }

     // Delete the user's current playlist
     await db.userPlaylists.destroy({
      where: { userId: userId }
    });

    const createdPlaylist = []

    for (const song of playlistData) {
      const createdSong =  await userPlaylist.create({
        userId: userId, 
        songName: song.songName,
        songArtist1: song.songArtist1,
        songArtist2: song.songArtist2,
        songArtist3: song.songArtist3,
        songGenre: song.songGenre
      });
      createdPlaylist.push(createdSong)
    }

    return sendJSONResponse(res, 200, "Playlist updated successfully", {userPlaylist: createdPlaylist});
  } catch (error) {
    console.error("Error updating playlist:", error);
    return sendBadRequest(res, 500, `Error while updating playlist: ${error.message}`);
  }
};



exports.getUserPlaylistById = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await db.users.findOne({ where: { id: userId }});
    if (!user) {
      return sendBadRequest(res, 404, "User Not Found");
    }

    const playlists = await db.userPlaylists.findAll({
      where: { userId: userId }
    });

    if (playlists && playlists.length > 0) {
      return sendJSONResponse(res, 200, "Playlists retrieved successfully", playlists);
    } else {
      return sendBadRequest(res, 404, "No playlists found for the given user ID");
    }
  } catch (error) {
    console.error("Error retrieving user playlists:", error);
    return sendBadRequest(res, 500, `Error while retrieving playlists: ${error.message}`);
  }
};
