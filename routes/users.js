var express = require("express");
var router = express.Router();
const user = require('./../modules/users');

router.post("/register", (req, res) => {
  console.log(req.body);
  user.register(res, req.body);
});

router.post("/login", (req, res) => {
  console.log("The reqbody");
  console.log(req.body);
  
  user.login(res, req.body);
});

module.exports = router;
