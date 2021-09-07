const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const moment= require('moment');
const upload = multer();
const cors = require("cors");
const mongoose = require("mongoose");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
   useUnifiedTopology: true,
  useCreateIndex: true
});

//Use the requirements
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // let's make json a bit cleaner
// app.set("json spaces", 2);

//Send the HTML
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//Import model

let Schema = mongoose.Schema

// Create schema
let userSchema = new Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date
    }
  ]
})

// Create model
let user = mongoose.model('user', userSchema)


// functions
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

//  /api/exercise/new-user  code
app.post("/api/users", (req, res, next) => {
  let username = req.body.username;

  if (username) {
    //check if name is entered in field
    let userAdd = { username: username, count: 0, log: [] };
    user.findOne({ username: userAdd.username }, (err, data) => {
      if (err) next(err);
      if (data) {
        res.send("Username is already taken.");
      } else {
        user.create(userAdd, (err, data) => {
          if (err) next(err);
          res.json({ username: data.username, _id: data._id });
        });
      }
    });
  } else {
    res.send("Please provide a username");
  }
});


 app.get("/api/users", (req, res) => {
  user.find((err, data) => {
    if (err) console.log("Error: " + err);
    else {
      res.json(data);
    }
  });
});

//  /api/exercise/add  code
app.post("/api/users/:_id/exercises", async (req, res) => {
  let {description, duration, date } = req.body;
  let id = req.params._id;
  if (!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString();
  }

  try{
    let findOne = await user.findOne({
      _id: id 
    })
    // If user exists, add exercise
    if (findOne){
      console.log("Retrieving Stored User")
      findOne.count++;
      findOne.log.push({
        description: description,
        duration: parseInt(duration),
        date: date
      });
      findOne.save();

      res.json({
          username: findOne.username,
          description: description,
          duration: parseInt(duration),
          _id: id,
          date: date
        });
    }
    // If user doesn't exist, return error
  } catch (err) {
    console.error(err);
  }
});


app.get("/api/users/:_id/logs", (req, res) => {

  user.findOne({_id: req.params._id}, (err, array) => {
    if (err) console.log(err);
    else {

      // adding limit parameters [7]
      // check to see if any query parameters exist for limit
      // This section was taken directly from: https://www.youtube.com/watch?v=ANfJ0oGL2Pk&ab_channel=GaneshH

      let resObj = array
      
      if(req.query.from || req.query.to){
        
        let fromDate = new Date(0)
        let toDate = new Date()
        
        if(req.query.from){
          fromDate = new Date(req.query.from)
        }
        
        if(req.query.to){
          toDate = new Date(req.query.to)
        }
        
        fromDate = fromDate.getTime()
        toDate = toDate.getTime()
        
        resObj.log = resObj.log.filter((log) => {
          let sessionDate = new Date(log.date).getTime()
          
          return sessionDate >= fromDate && sessionDate <= toDate
          
        });
      }
      
      if(req.query.limit){
        resObj.log = resObj.log.slice(0, req.query.limit)
      }
      // end of taken snippet


      // returning object with data values and adding a field to it [5/6]
      let obj = {};
      obj._id = array._id;
      obj.username = array.username;
      obj.log = array.log;
      obj.count = array.log.length;
      res.json(obj);

    } // end else
  });
});


// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});