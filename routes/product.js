var express = require("express");
var router = express.Router();
const product = require("./../modules/product");

router.get("/inventory/:username",
  (req, res, next) => product.checkToken(req, res, next),
  (req, res) => {
    product.getInventory(res, req);
});

router.get("/", (req, res, next) => product.checkToken(req, res, next),
  (req, res) => {
    product.getProducts(res, req);
});

router.post("/inventory",
  (req, res, next) => product.checkToken(req, res, next),
  (req, res) => {
    product.addInventory(res, req.body);
});

router.delete("/inventory",
  (req, res, next) => product.checkToken(req, res, next),
  (req, res) => {
    product.sellItem(res, req.body);
});

router.put("/addMelaCash", 
  (req, res, next) => product.checkToken(req, res, next),
  (req, res) => {
    product.addMelaCash(res, req.body);
});

router.post("/sell", (req, res) => {
  (req, res, next) => product.checkToken(req, res, next),
  (req, res) => {
    product.sellProduct(res, req.body);
  }
});

router.post("/buy", (req, res) => {
  (req, res, next) => product.checkToken(req, res, next),
    (req, res) => {
      product.buyProduct(res, req.body);
    };
});



module.exports = router;



// buy
// sell
// saldo
// inventory