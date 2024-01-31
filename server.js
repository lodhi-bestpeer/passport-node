const express = require("express");
const cors = require("cors");
const { connection } = require("./dbConnection");
const passport = require("passport")
const path = require("path");
const expressSession = require("express-session")
// const flash = require('connect-flash');

const User = require("./model");
const { passportInit, isAuthenticate } = require("./views/local.strategy");

const app = express();
passportInit(passport)

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  }));
//   app.use(flash());
// app.use(expressSession({secret:"secret",resave:false, saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'views')));

app.set("view engine", "ejs");


app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error, "error");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const user = await User.create({ ...req.body });
  res.send(user);
});

// send custom error in the response
app.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/profile");
        // res.send(req.user)
      });

  })(req, res, next);
});


// app.post("/login", passport.authenticate('local',{failureRedirect:"/register",successRedirect:"/profile"}));

app.get("/profile", isAuthenticate,(req,res)=>{
   res.send(req.user)
})

app.get("/logout",(req, res)=>{
    req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging out" });
        }
        res.json({ message: "Logout successful" });
      });
})

app.listen(8080, () => {
  connection();
  console.log("Server is running at http://localhost:8080");
});
