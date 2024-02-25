const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const { sendBadRequest } = require("../utils/handle");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return sendBadRequest(res, 403, "No token provided.");
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, 'for_you_backend', (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const user = await db.users.findByPk(decoded.id);
    if (!user) {
      return sendBadRequest(res, 404, "User not found.");
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendBadRequest(res, 401, "Unauthorized! Token has expired.");
    } else {
      return sendBadRequest(res, 401, "Unauthorized!");
    }
  }
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
