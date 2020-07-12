var express = require("express"),
    router  = express.Router(),
 bodyParser = require("body-parser"),
    request = require("request"),
    moment = require('moment');

    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));

//define variables
var pageNum;
episodeReport = {
  count: 0,
  createdDate: []
};

// ------------------------
// Episodes Route
// ------------------------

// Get Method: episodes router
router.get("/episode", (req,res) =>{
  // saving report variables
  episodeReport.count++;
  episodeReport.createdDate.push(moment(Date.now()).format('LLL'));

  // check if pageNum is not NaN or String
  if (Number.isNaN(Number(req.query.page))) {
    pageNum = 1;
  }else {
    pageNum = req.query.page;
  }

  if (pageNum == undefined) {
    pageNum = 1;
  }
  // request from api to get data back
  request("https://rickandmortyapi.com/api/episode?page=" + pageNum , (error, response, body) =>
  {
    var parseData = JSON.parse(body);
        res.render("episode/show", {parseData: parseData, pageNum: Number(pageNum)});
  });
});
// POST Method: episode router
router.post("/episode",(req,res) => {
  //check if prevPage is null otherwise prevPage button will hide
  if (req.body.prevPage != null) {
    var prev = new URL(req.body.prevPage);
    var prevPage = prev.searchParams.get("page");
    res.redirect("/episode?page=" + prevPage);
  }else{
    var next = new URL(req.body.nextPage);
    var nextPage = next.searchParams.get("page");
    res.redirect("/episode?page=" + nextPage);
  }

});

// GET Method: search episode by id
router.get("/episode/:id", (req,res) => {
  var id = req.params.id;

  // request from episode api to get data back
  request("https://rickandmortyapi.com/api/episode/" + id, (error,response,body) => {
    var parseData = JSON.parse(body);
    res.render("episode/showItem", {parseData: parseData, pageNum: pageNum});
  });
});
// POST Method: search character by id
router.post("/episode/:id", (req,res) => {
  res.redirect("/episode/" + req.params.id);
});

module.exports = router;
