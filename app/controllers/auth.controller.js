const db = require("../models");
const config = require("../config/auth.config");
const twilioService = require("../services/twilioService");


const User = db.users;
const { sendJSONResponse, sendBadRequest, generateRandomString } = require("../utils/handle");
const { checkEmail } = require("../utils/extraFucntions");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");



exports.signin = async (req, res) => {
  try {
    condition={};
    if(checkEmail(req.body.userInput)) {
      condition.email= req.body.userInput;
    } else {
      condition.username= req.body.userInput;
    }
    const user = await User.findOne({
      where: condition
    })
    if (!user) {
      return sendBadRequest(res, 404, "User Not Found");
    }
    if (!user.password){
      return sendBadRequest(res,401,"You have already this account with google or facebook");
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return sendBadRequest(res, 401, "Invalid Password!");
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    return sendJSONResponse(res, 200, "Signed In", {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userLoginState: user.updateState
      },
      accessToken: token,
    })
  }
  catch (err) {
    return sendBadRequest(res, 500, `${err.message}`)
  }
};

exports.getGoogleUserData = async (req, res) => {
  try {
    const {email}=req.body;

    const user = await User.findOne({
      where: {
        email: email
      }
    });

    // If user doesn't exist, create the user 
    // and assign a access_token to the user
    if(!user) {

      const newUser = await User.create({
        email: email,
        username: email.split("@")[0],
        isVerfified: true,
        password: ''
      });
      console.log(newUser);
      let token = jwt.sign({ id: newUser.dataValues.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      return sendJSONResponse(res, 200, "User created", {
        user: newUser,
        accessToken: token
      });
    }

    // if(user.password) {
    //   return sendBadRequest(res, 404, "User has already registered with this email.");
    // }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    return sendJSONResponse(res, 200, "User logged-in", {
      user,
      accessToken: token
    });
  } catch (err) {
    return sendBadRequest(res, 400, err.message);
  }
}

exports.verifyUserEmail = async (req, res) => {
  try {
    const user = await User.findOne({ uniqueString: req.params.uniqueString });
    console.log(user);
    const date = new Date(user.updatedAt)
    if (!user)
      return sendBadRequest(res, 404, "User not found!");
    if (user.isVerified)
      return sendBadRequest(res, 401, "Invalid operation");

    let timeElapsed = (Date.now() - date.getTime()) / 1000;
    timeElapsed /= (60 * 60);
    timeElapsed = Math.abs(Math.round(timeElapsed));
    if (timeElapsed < 24) {
      user.isVerified = true;
      await user.save();
      return sendJSONResponse(res, 200, 'User Verified');
    }else {
      return sendJSONResponse(res, 200, 'Link Expired');
    }
  } catch (err) {
    return sendBadRequest(res, 401, err.message);
  }
}



//send OTP via twilio
exports.sendOtp = async (req, res) => {
  try {
    const verification = await twilioService.sendSmsVerification(req.body.phoneNumber);
    res.status(200).json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//verify OTP via twilio
exports.verifyOtp = async (req, res) => {
  try {
    const verificationCheck = await twilioService.verifySmsCode(req.body.phoneNumber, req.body.code);
    let user;
    user = await User.findOne({
      where: {phoneNumber: req.body.phoneNumber}
    })
    if(!user) {
      user = await User.create({
        phoneNumber: req.body.phoneNumber
      });
    }
    let token = jwt.sign({ id: user.dataValues.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    return sendJSONResponse(res, 200, "User created", {
      user,
      accessToken: token
    });
  } catch (err) {
     return sendBadRequest(res, 500, `${err.message}`)
  }
};



