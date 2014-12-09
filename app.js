var express = require("express"),
  bodyParser = require("body-parser"),
  db = require("./models"),
  passport = require("passport"),
  session = require("cookie-session"),
  app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

/*
 Session is an object that lives in your
  app and it remembers who is signed in, 
  because the interwebs are STATELESS!!!!
 */

app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  // this is in milliseconds
  maxage: 3600000
  })
);
app.get("/sign_up", function (req, res) {
  res.render("users/sign_up");
});

// get passport started
app.use(passport.initialize());
app.use(passport.session());

// prepare our serialize functions

// Serialize turns relevant data into strings
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

// deSerialize uses the data stored in a string
//  recover the original object, i.e. looks it up
//  in the db
passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .then(function(user){
      done(null, user);
    });
});

app.post("/users", function (req, res) {
  console.log("POST /users");
  var newUser = req.body.user;
  console.log("New User:", newUser);
  // We create the user and secure their password info
  db.user.createSecure(newUser.email, newUser.password, 
    function () {
      // if it fails redirect to sign up
      res.redirect("/sign_up");
    },
    function (err, user) {
      // logs them in
      passport.authenticate('local')(req, res, function(){
        console.log("Id: ", user.id)
        res.redirect('/users/' + user.id);
      });
    }
  )
});


app.get("/users/:id", function (req, res) {
  var id = req.params.id;
  db.user.find(id)
    .then(function (user) {
      res.render("users/show", {user: user});
    })
    .error(function () {
      res.redirect("/sign_up");
    })
});




app.listen(3000, function () {
  console.log("LISTENING");
})






