const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/users.sqlite");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtFile = require("./jwtsecret.json");
const jwtSecret = jwtFile.secret;

const product = {
  addInventory: (res, body) => {
    const username = body.username;
    const productToAdd = body.product;

    if (!username || !productToAdd) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/",
          title: "Wrong body input",
          detail: "username or product to buy was not found in body"
        }
      });
    }
    db.get("PRAGMA foreign_keys = ON");

    let melacash = 0;
    let price = 0;

    db.serialize(function() {
      db.get(
        "SELECT melacash FROM users WHERE username = ?",
        username,
        (err, row) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
          console.log(row);

          melacash = row.melacash;
          console.log("melacash: " + melacash);
        }
      );
      db.get(
        "SELECT price FROM products WHERE product = ?",
        productToAdd,
        (err, row) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
          price = row.price;
          console.log("price: " + price);
          if (melacash - price >= 0) {
            melacash = melacash - price;
            db.run(
              "UPDATE users set melacash = ? WHERE username = ?",
              melacash,
              username,
              (err, row) => {
                if (err) {
                  return res.status(500).json({ message: err });
                }
                db.run(
                  "INSERT INTO inventory(username, product) " + "VALUES(?, ?)",
                  username,
                  productToAdd,
                  err => {
                    if (err) {
                      return product.errorRes(res, "/addInventory", err);
                    }
                    return res.status(201).json({
                      data: {
                        message:
                          "Item was added into " + username + "´s inventory."
                      }
                    });
                  }
                );
              }
            );
          } else {
            res.status(401).json({
              message: "Not enough MelaCash to buy the " + productToAdd
            });
          }
        }
      );
    });
  },
  sellItem: (res, body) => {
    const username = body.username;
    const inventoryID = body.inventoryID;

    if (!username || !inventoryID) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/",
          title: "Wrong body input",
          detail: "username or inventoryID to sell was not found in body"
        }
      });
    }

    db.get("PRAGMA foreign_keys = ON");

    //TODO ADD CASH WHEN SELLING
    db.get(
      "SELECT EXISTS(SELECT 1 FROM inventory WHERE inventoryID = ? AND username = ?) AS rowExists",
      inventoryID,
      username,
      (err, row) => {
        if (err) {
          return product.errorRes(res, "/intenvory", err);
        }
        console.log("15");
        console.log(row);

        if (row.rowExists == 1) {
          db.get(
            "UPDATE users SET melacash = melacash + " +
              "(SELECT price FROM products INNER JOIN inventory ON inventory.product = products.product WHERE inventoryID = ?) " +
              "WHERE username = ?",
            inventoryID,
            username,
            err => {
              console.log("hej");

              if (err) {
                return product.errorRes(res, "/intenvory", err);
              }

              db.run(
                "DELETE FROM inventory WHERE inventoryID = ? AND username = ?",
                inventoryID,
                username,
                err => {
                  if (err) {
                    return product.errorRes(res, "/intenvory", err);
                  }
                  console.log("hejsan");
                  return res.status(200).json({
                    data: {
                      message: "Item was successfully sold."
                    }
                  });
                }
              );
            }
          );
        } else {
          return res.status(401).json({
            message: "The item was not found in the users inventory"
          });
        }
      }
    );
  },
  getProducts: (res, body) => {
    db.all("SELECT * from products",
    (err, rows) => {
      if (err) {
        return product.errorRes(res, "/", err);
      }
      if (rows === undefined || rows === null) {
        return res.status(401).json({
          errors: {
            status: 401,
            source: "/",
            title: "No products found",
            detail: "No products exists"
          }
        });
      }
      let products = [];
      rows.forEach(element => {
        products.push({
          [element.product]: element.price
        })
      });
      let data = {
        products
      }
      return res.json({data})
    })
  },
  getInventory: (res, req) => {
    const username = req.params.username;
    console.log(username);

    if (!username) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/inventory",
          title: "Wrong body input",
          detail: "username was not found in body"
        }
      });
    }

    let melaCash;

    db.serialize(function() {
      db.get(
        "SELECT melacash FROM users WHERE username = ?",
        username,
        (err, row) => {
          melaCash = row.melacash;
        }
      );

      db.all(
        "SELECT product, inventoryID " +
          "FROM inventory " +
          "WHERE username = ?",
        username,
        (err, rows) => {
          if (err) {
            return product.errorRes(res, "/inventory", err);
          }

          if (rows === undefined || rows === null) {
            return res.status(401).json({
              errors: {
                status: 401,
                source: "/inventory",
                title: "Inventory is not found",
                detail: "Inventory for " + username + " does not exist."
              }
            });
          }

          let products = [];
          rows.forEach(element => {
            let obj = {
              [element.inventoryID]: element.product
            };
            products.push(obj);
          });

          const data = {
            melacash: melaCash,
            products: products
          };

          return res.json({ data });
        }
      );
    });
  },
  addMelaCash: (res, body) => {
    const amountOfCash = body.melacash;
    const username = body.username;

    if (!amountOfCash || !username) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/addMelaCash",
          title: 'No "melaCash" or "username" specified',
          detail: "melaCash or username in body was not specified"
        }
      });
    }

    db.run(
      "UPDATE users SET melacash = melacash + ? WHERE username = ?",
      amountOfCash,
      username,
      err => {
        if (err) {
          return product.errorRes(res, "/addMelaCash", err);
        }
        res.status(204).send();
      }
    );
  },
  errorRes: (res, path, err) => {
    return res.status(500).json({
      errors: {
        status: 500,
        source: path,
        title: "Database error",
        detail: err.message
      }
    });
  },
  checkToken: (req, res, next) => {
    var token = req.headers["x-access-token"];

    if (token) {
      jwt.verify(token, jwtSecret, err => {
        if (err) {
          return res.status(500).json({
            errors: {
              status: 500,
              source: req.path,
              title: "Failed authentication",
              detail: err.message
            }
          });
        }
        console.log("====================================");
        console.log("Token is okay");
        console.log("====================================");
        // req.user = {};
        // req.user.api_key = decoded.api_key;
        // req.user.email = decoded.email;

        next();

        return undefined;
      });
    } else {
      return res.status(401).json({
        errors: {
          status: 401,
          source: req.path,
          title: "No token",
          detail: "No token provided in request headers"
        }
      });
    }
  }
};

module.exports = product;