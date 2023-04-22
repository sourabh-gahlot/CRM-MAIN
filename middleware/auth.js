const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const User = require("./../models/User.model");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "no token Provided",
    });
  }

  jwt.verify(token, config.Secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({
        message: "unauthorized",
      });
    }

    req.userId = decoded.id;

    next();
  });
};
isAdmin = async (req, res, next) => {
  const user = await User.findOne({
    userId: req.userId,
  });
  if (user && user.userType == "ADMIN") {
    next();
  } else {
    return res.status(403).send({
      message: "only admin can acess",
    });
  }
};

checkUserType = async (req, res, next) => {
  const loggeduser = await User.findOne({
    userId: req.userId,
  });
  const usertoupdate = await User.findOne({
    userId: req.params.id,
  });
  if (loggeduser && loggeduser.userType == "ADMIN") {
    next();
  } else if (
    loggeduser.userType == "CUSTOMER" ||
    loggeduser.userType == "ENGINEER"
  ) {
    if (loggeduser.userId == usertoupdate.userId) {
      next();
    } else {
      return res.status(403).send({
        message: "you are not owner",
      });
    }
  } else {
    return res.status(403).send({
      message: "only admin can acess",
    });
  }
};

const authcheck = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  checkUserType: checkUserType,
};

module.exports = authcheck;
