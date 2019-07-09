var express = require("express");
var router = express.Router();

router.get("/:id/:dumb", function(req, res, next) {
  const data = {
    data: {
      msg: "Hello World " + req.params.id,
      data: "Yo" + req.params.dumb
    }
  };

  res.json(data);
});

module.exports = router;
