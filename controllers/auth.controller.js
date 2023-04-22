const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const secretconfig=require("./../configs/auth.config")
/**
 * Signup Api
 */

exports.signup = async (req, res) => {
  var userTypeReq = req.body.userType;
  var userStatusReq = "APPROVED";
  if (userTypeReq == "ENGINEER") {
    userStatusReq = "PENDING";
  }

  const userObj = {
    name: req.body.name,
    userId: req.body.userId,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    userType: req.body.userType,
    userStatus: userStatusReq,
  };
  try {
    const user = await User.create(userObj);
    res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: userStatusReq,
    });
  } catch (err) {
    console.log("error creating user", err.message);
    res.status(500).send({
      message: "internal server error",
    });
  }
};

exports.signin=async(req,res)=>{
  
  
  const user = await User.findOne({userId:req.body.userId})
  if(user==null){
    return res.status(400).send({
      message:"userid doesnot exist"
    })
  }

  if(user.userStatus!="APPROVED"){
    return res.status(400).send({
      message:"can't login with status pending"
    })
  }
  if(!bcrypt.compareSync(req.body.password,user.password)){
    return res.status(200).send({
      message:"invalid password"
    })
  }
  
  var token = jwt.sign({
    id:user.userId
  },secretconfig.Secret,{expiresIn:5000})
  res.status(200).send({
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
      acessToken: token
  }) 





}