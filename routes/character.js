var express = require("express"),
    router  = express.Router(),
 bodyParser = require("body-parser"),
    request = require("request"),
    moment  = require('moment');

    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));


// define variables
var characterName;
var pageNum;
characterReport = {
  count: 0,
  createdDate: []
};
app.locals.characterReport = characterReport;
// ------------------------
// Character Route
// ------------------------

// render index.ejs
router.get("/",(req,res) => {
    res.render("index");
});

// GET Method: character router
router.get("/character",(req,res) => {
    // saving report variables
    characterReport.count++;
    characterReport.createdDate.push(moment(Date.now()).format('LLL'));

    // check if pageNum is not NaN or String
    if (Number.isNaN(Number(req.query.page))) {
      pageNum = 1;
    }else {
      pageNum = req.query.page;
    }

    if (pageNum == undefined) {
      pageNum = 1;
    }
    // check if there are a name to search it
    characterName = req.query.characterName;
    if (characterName == undefined) {
      characterName = "";
    }else {
      characterName = req.query.characterName;
    }
    // request from api to get data back
    request("https://rickandmortyapi.com/api/character/?page=" + pageNum + "&name=" + characterName, (error, response, body) =>
    {
      if(!error && response.statusCode == 200)
      {
        var parseData = JSON.parse(body);
        res.render("character/show", {parseData: parseData, pageNum: Number(pageNum), characterName:characterName});
      }else {
        res.render("error");
      }

    });
});
// POST Method: character router
router.post("/character",(req,res) => {
  //check if prevPage is null otherwise prevPage button will hide
  if (req.body.prevPage != null) {
    var prev = new URL(req.body.prevPage);
    var prevPage = prev.searchParams.get("page");
    var prevQueryName = prev.searchParams.get("characterName");
    res.redirect("/character?page=" + prevPage + "&characterName=" + prevQueryName);
  }else{
    var next = new URL(req.body.nextPage);
    var nextPage = next.searchParams.get("page");
    var nextQueryName = next.searchParams.get("characterName");
    res.redirect("/character?page=" + nextPage + "&characterName=" + nextQueryName);
  }

});

// GET Method: search character by id
router.get("/character/:id", (req,res) => {
  var id = req.params.id;

  // request from character api to get data back
  request("https://rickandmortyapi.com/api/character/" + id, (error,response,body) => {
    if(!error && response.statusCode == 200)
    {
      var parseData = JSON.parse(body);
      // request from location api to get data back
      request("https://rickandmortyapi.com/api/location/" + id, (error,response,body) => {
      var locationParseData = JSON.parse(body);
        // get, when character was first seen in the cartoon
        request(parseData.episode[0],(error,response,body) => {
          var episodeParseData = JSON.parse(body);
          res.render("character/showItem", {parseData: parseData, location: locationParseData,pageNum: pageNum, episode: episodeParseData,characterName:characterName});
        });
      });
    }else {
      res.render("error");
    }
  });
});
// POST Method: search character by id
router.post("/character/:id", (req,res) => {
  res.redirect("/character/" + req.params.id);
});

module.exports = router;
