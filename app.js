var express = require("express"),
  app = express();

app.get("/", function (req, res) {
  console.log(req.get("cookie"));
  var rawValue = req.get("cookie")
  var count = parseInt(rawValue) || 0;
  count += 1;
  res.set("Set-Cookie",  count)
  res.send("hello " + count);
});

app.listen(3000);
