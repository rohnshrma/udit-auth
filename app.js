require('dotenv').config()

//jshint esversion:6



const express = require("express");
const app = express();
var md5 = require('md5');
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/secretsDB");

// schema
const userSchema = new mongoose.Schema({
  fullName: {
    required: true,
    type: String,
  },
  userName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

const User = new mongoose.model("User", userSchema);

// routes
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const fullName = req.body.fullname;
  const userName = req.body.username;
  const password = req.body.password;

  const user = new User({
    fullName: fullName,
    userName: userName,
    password: password,
  });

  user.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const reqEmail = req.body.username;
  const reqPass = req.body.password;
  User.find({ userName: reqEmail }, (err, foundUser) => {
    if (!err) {
      if (foundUser[0].password == reqPass) {
        res.render("secrets");
      }else{
        res.redirect("/login")
      }
    }
  });
});

app.listen(3000, () => {
  console.log("server started on port : 3000");
});
