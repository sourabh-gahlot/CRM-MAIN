const userController = require("../controllers/user.controller")
const express= require("express")
const authMiddleware=require("../middleware/auth")
module.exports= function(app){

  app.get("/crm/api/v1/users",[authMiddleware.verifyToken,authMiddleware.isAdmin],userController.findAll)
  app.get("/crm/api/v1/user/:id",userController.findById)
  app.put("/crm/api/v1/user/:id",[authMiddleware.verifyToken,authMiddleware.checkUserType],userController.update)


}