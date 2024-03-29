const userController = require("../controllers/user.controller");
const friendrequestController = require("../controllers/friendRequest.controller");
const userimageController = require("../controllers/userImage.controller");

const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //check routes and code clean up
  app.post('/api/user', userController.createUserOrLoginUser);
  app.get('/api/user/:id', [authJwt.verifyToken],userController.getUserById);
  app.post('/api/user/:id/playlist',[authJwt.verifyToken], userController.createPlaylist);
  app.get('/api/user/:id/playlist', [authJwt.verifyToken],userController.getUserPlaylistById);
};
 
