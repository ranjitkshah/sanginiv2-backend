const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.post(
  //   "/api/auth/signup",
  //   [verifySignUp.checkDuplicateUsernameOrEmail],
  //   controller.signup
  // );

  // app.post("/api/auth/google", controller.getGoogleUserData);
  
  // app.post("/api/auth/signin", controller.signin);
  // app.get("/api/auth/verify/:uniqueString", controller.verifyUserEmail);
  // app.get("/api/auth/resendVerificationEmail/:uniqueString", controller.resendVerificationEmail);

  //v2 apis
  app.post("/api/otp/send", controller.sendOtp);
  app.post("/api/otp/verify", controller.verifyOtp)


};
