const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const port = 1337;


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

const index = require('./routes/index');
const hello = require("./routes/hello");


app.use('/', index);
app.use('/hello', hello);

// // Add a route
// app.get("/", (req, res) => {
//       const data = {
//         data: {
//           msg: "Hello World"
//         }
//       }

//       res.json(data);
// });

app.get("/buy/:productId", (req, res) => {
  const data = {
    data: {
      msg: "You bought a " + req.params.productId
    }
  };

  res.json(data);
});

app.post("/", (req, res) => {
  res.status(201).json({
    data: {
      msg: "Post data"
    }
  });
});

app.put("/", (req, res) => {
  res.status(204).send();
});

app.delete("/", (req, res) => {
  res.status(204).send();
});

app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    errors: [
      {
        status: err.status,
        title: err.message,
        detail: err.message
      }
    ]
  });
});

// Start up server
app.listen(port, () => console.log(`Mela API listening on port ${port}!`));
