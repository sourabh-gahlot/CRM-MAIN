const express = require("express");
const app = express();
const serverconfig = require("./configs/server.config");
const dbconfig = require("./configs/db.config");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.connect(dbconfig.DB_Url);
const db = mongoose.connection;
db.once("open", () => {
  console.log("db connection sucessfull");
});
db.on("error", () => {
  console.log("error connection to mongodb");
  process.exit();
});

require("./routes/auth.route")(app);
require("./routes/user.route")(app);
require("./routes/ticket.route")(app);

app.listen(serverconfig.port, () => {
  console.log(`server is runing on port ${serverconfig.port}`);
});
