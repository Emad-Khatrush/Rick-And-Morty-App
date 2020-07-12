var express = require("express"),
    router  = express.Router();

// ------------------------
// Report Route
// ------------------------
router.get("/report", (req,res) => {
  
  res.render("report",{episodeReport: episodeReport, characterReport: characterReport});
});

module.exports = router;
