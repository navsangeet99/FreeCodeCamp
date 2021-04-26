var bodyParser= require ('body-parser');
var express = require('express');
var app = express();

///root level request logger middelware
app.use(function(req, res, next){
  var string = req.method + " " + req.path + " - " + req.ip;
      console.log(string);
      next();
}); //have to comment out the below code from console for the result

//chain middleware to create time server
app.get('/now', function(req, res, next) {
  req.time = new Date().toString();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
   res.send({time: req.time});
   }
);

//get route parameter input from client
app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({
    echo: word
  });
});

//get query parameter from the client
app.get("/name", function(req, res) {
  var firstName = req.query.first;
  var lastName = req.query.last;
  // Use template literals to form a formatted string
  res.json({
    name: `${firstName} ${lastName}`
  });
});

//use body-parser to parse post req
app.use(
  bodyParser.urlencoded({extended: false})
);

app.use(
  bodyParser.json()
);

app.post('/name', function(req, res) {
  // Handle the data in the request
  var string=req.body.first+ " "+ req.body.last;
  res.json({ name: string });
});

/*console.log("Hello World"); //meet the node console
app.get("/", function(req, res) { //working express server
  res.send("Hello Express");
}); //have to comment out this function so the html can work below
app.get("/", function(req, res) { //serve a html file
  res.sendFile(__dirname + "/views/index.html");
});
app.use("/public", express.static (__dirname + "/public")); //serve static assets-css
app.get("/json", (req, res) => { //serve json on specific route
  res.json({
    message: "Hello json"
  });
});*/

app.get('/json', (req, res) => { //use env file that has secret key and value
  process.env.MESSAGE_STYLE === 'uppercase' ?
    res.json({ "message": "HELLO JSON" }):
    res.json({ "message": "Hello json" })
})

 module.exports = app;
