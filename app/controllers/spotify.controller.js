const { generateRandomString } = require("../utils/generateRandomString");
require("dotenv").config();
const request = require("request");
const SpotifyWebApi = require("spotify-web-api-node");
const querystring = require("querystring");
const { sendJSONResponse, sendBadRequest } = require("../utils/handle");
const stateKey = "spotify_auth_state";
const db = require("../models");
const { access } = require("fs");
const User = db.users;
const UserTrack = db.usertracks;
const Track = db.tracks;


exports.spotifySearchSong = async (req, res) => {
  var spotifyApi = new SpotifyWebApi({
    clientId: "d7bed51d359e491e9ee15890d476b423",
    clientSecret: "4a6d999b92fc4c48a7324eeefcfe6c32",
  });
  try {
      let lastTimeTokenUpdated = Date.now();
      const searchQuery = req.query.search;
  
    if (true) {
      const clientData = await spotifyApi.clientCredentialsGrant();
      console.log("The access token expires in " + clientData.body["expires_in"]);
      console.log("The access token is " + clientData.body["access_token"]);
  
      lastTimeTokenUpdated = Date.now() + clientData.body["expires_in"] * 1000;
      spotifyApi.setAccessToken(clientData.body["access_token"]);
    }
  
    const tracks = await spotifyApi.searchTracks(searchQuery);
    const data =  tracks?.body?.tracks?.items
  
    return sendJSONResponse(res,200, "spotify search success" ,data)
  } catch (err) {
    return sendBadRequest(res, 500, `${err.message}`)
  }
 
}