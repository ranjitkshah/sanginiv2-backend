const controller = require("../controllers/spotify.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
    app.get('/spotify/search',controller.spotifySearchSong)
}   