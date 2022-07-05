require("dotenv").config();

//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// authentication & encryption (modules to be required)
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
const passportLocal = require("passport-local")
const session = require("express-session")

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.use(session({
  secret : "ourLittleSecret",
  resave: false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session())


mongoose.connect("mongodb://localhost:27017/secretsDB");

// schema
const userSchema = new mongoose.Schema({
  // fullName: {
  //   required: true,
  //   type: String,
  // },
  username: {
    // required: true,
    type: String
  },
  password: {
    // required: true,
    type: String
  },
});

userSchema.plugin(passportLocalMongoose)


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// routes
app.get("/", (req, res) => {
  res.render("home");
});


app.get("/secrets",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets")
  }else{
    res.redirect("/login")
  }
})


app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
console.log(req.body)

User.register({username:req.body.username},req.body.password,(err,user)=>{
  if(err){
    console.log(err);
    res.redirect("/register")
  }else{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/secrets")
    })
  }
})



});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const reqEmail = req.body.username;
  const reqPass = req.body.password;

  
});

app.listen(5500, () => {
  console.log("server started on port : 5500");
});
