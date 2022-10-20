const express = require("express");
const Routes = require("./routes/router");
const {notFound, expressErrorHandler} = require("./modules/errorHandler");
const mongoose = require("mongoose");
const path = require("path");
mongoose.connect("mongodb://localhost:27017/TaskManagerDB", (error) => {
    if (!error) console.log("connected to db ...");
});
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use("/", Routes);
app.use(notFound);
app.use(expressErrorHandler);
app.listen(2500, () => {
    console.log("serer run on : http://localhost:2500");
});
