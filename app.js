// require npm packages
var express = require("express"),
        app = express(),
 bodyParser = require("body-parser"),
    request = require("request"),
     moment = require('moment');

// require routes
var characterRoute = require("./routes/character"),
    episodeRoute   = require("./routes/episode"),
    reportRoute    = require("./routes/report");

// setup packages
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(characterRoute);
app.use(episodeRoute);
app.use(reportRoute);

//otherwise error
app.get("*", (req,res) => {
  res.render("error");
});
app.listen(process.env.PORT,process.env.IP, function()
{
    console.log("Server has Started");
});
