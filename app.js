var express = require("express"),
  bodyParser = require("body-parser"),
  db = require("./models"),
  app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/sign_up", function (req, res) {
  res.render("users/sign_up");
});

app.post("/users", function (req, res) {
  console.log("POST /users");
  var newUser = req.body.user;
  console.log("New User:", newUser);
  db.user.createSecure(newUser.email, newUser.password, 
    function () {
      res.redirect("/sign_up");
    },
    function (user) {
      res.redirect("/users/" + user.id);
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






