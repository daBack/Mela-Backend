const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = 1337;
var http = require('http').Server(app);
const io = require('socket.io')(http);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This is middleware called for all routes.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

/* 
    IMPORTING ROUTES AND SOCKET FUNCTIONS
*/
const user = require("./routes/users");
const product = require("./routes/product");
const ioServer = require("./modules/websocket.js");

/*
    ROUTES
*/
// put och delete = 204
app.use('/user', user);
app.use('/product', product);

/*
    WebSocket Connection
*/
io.on('connection', function(socket) {
  console.log('Store connected');
  socket.on('disconnect', function() {
    console.log('Store disconnected');
  });
});


setInterval( async function() {
  let data = await ioServer.emitPrice()
  await console.log("data");
  await console.log(data);
  
  await io.emit('data', data)
}, 10000);
/*
    ERROR HANDLING
*/
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
// app.listen(port, () => console.log(`Mela API listening on port ${port}!`));
http.listen(port, () => console.log(`Mela API listening on HTTP port ${port}! Swag..`));
