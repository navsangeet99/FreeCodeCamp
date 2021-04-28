// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// timestamp endpoint with no parameter...
/*app.get("/api/timestamp/", (req, res) => {
  res.json({ unix: Date.now(), utc: Date() });
});*/

app.get("/api", (_req, res) => {
  const date = new Date();
  res.json({unix: date.valueOf(), utc: date.toGMTString()});
});
app.get("/api/:time", (req, res) => {
  let date;
  if (/^\d+$/.test(req.params.time)) {
    date = new Date(parseInt(req.params.time));
  }
  else {
    date = new Date(req.params.time);
  }
  
  if (date.toString() !== 'Invalid Date') {
    res.json({unix: date.valueOf(), utc: date.toGMTString()});
  } else {
    res.json({error: "Invalid Date"});
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
