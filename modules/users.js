
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/users.sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtFile = require('./jwtsecret.json');
const jwtSecret = jwtFile.secret

const users = {
  login: (res, body) => {
    const username = body.username;
    const password = body.password;
    console.log('====================================');
    console.log(username);
    console.log(password);
    console.log('====================================');
    if (!username || !password) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/login",
          title: "Username or password missing",
          detail: "Username or password missing in request"
        }
      });
    }

    db.get('SELECT * FROM users WHERE username = ?',
      username,
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            errors: {
              status: 500,
              source: "/login",
              title: "Database error",
              detail: err.message
            }
          });
        }

        if (rows === undefined) {
          return res.status(401).json({
            errors: {
              status: 401,
              source: "/login",
              title: "User is not found",
              detail: "User with said username does not exist."
            }
          });
        }

        const user = rows;

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({
              errors: {
                status: 500,
                source: "/login",
                title: "bcrypt error",
                detail: "bcrypt error"
              }
            });
          }

          if (result) {
            let payload = { username: user.username };
            let jwtToken = jwt.sign(payload, jwtSecret, {expiresIn: '24h'});

            return res.json({
              data: {
                type: "success",
                message: "User logged in",
                user: payload,
                token: jwtToken
              }
            });
          }

          return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Wrong password",
                detail: "Password is incorrect."
            }
          });
        });
      });

  },
  register: (res, body) => {

    const username = body.username;
    const password = body.password;
    console.log(username);
    console.log(password);
    
    if (!username || !password) {
      return res.status(401).json({
        errors: {
          status: 401,
          source: "/register",
          title: "Username or password missing",
          detail: "Username or password missing in request"
        }
      });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          errors: {
            status: 500,
            source: "/register",
            title: "Bcrypt error",
            detail:
              "Bcrypt error"
          }
        });
      }

      db.run('INSERT INTO users (username, password) VALUES (?, ?)',
        username,
        hash, (err) => {
          if (err) {
            return res.status(500).json({
              errors: {
                status: 500,
                source: "/register",
                title: "Database error",
                detail:
                  err.message
              }
            });
          }

          return res.status(201).json({
            data: {
              message: "User successfully registered."
            }
          });
        });
    });
  },

  //MORE FUNCTIONS
};

module.exports = users