const User = require("./../models/User.model");
const objectConvertor = require("../utils/objectConvertor");
/**
 * fetch of all the user {later we will modify }
 */

exports.findAll = async (req, res) => {
  try {
    let userQuery = {};
    let userTypeReq = req.query.userType;
    let userStatusReq = req.query.userStatus;

    if (userTypeReq) {
      userQuery.userType = userTypeReq;
    }
    if (userStatusReq) {
      userQuery.userStatus = userStatusReq;
    }

    const users = await User.find(userQuery);
    res.status(200).send(objectConvertor.userResponse(users));
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal server Error",
    });
  }
};

exports.findById = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).send({ message: "No user id provided" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // console.log(user);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).send({ message: "No user id provided" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // console.log(user);
    user.name=req.body.name ? req.body.name : user.name
    user.userType=req.body.userType ? req.body.userType : user.userType
    user.userStatus=req.body.userStatus ? req.body.userStatus : user.userStatus

    const newUser = await user.save();
    var userobj={
      name:newUser.name,
      userId:newUser.userId,
      email:newUser.email,
      userType:newUser.userType,
      userStatus:newUser.userStatus
    }
    res.status(200).send(userobj);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
};
