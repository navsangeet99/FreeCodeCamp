var express = require('express');
var cors = require('cors');
const path = require('path');
require('dotenv').config()
var multer  = require('multer');

//multer is used to parsed form data with multipart type
//use this if you want the files to be saved in the folder "uploads"
var upload = multer({ dest: 'uploads/' });
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
var bodyParser = require('body-parser');
app.use (bodyParser.urlencoded({ extended: true }));

app.set('views',  path.join(process.cwd(), 'views'));
app.set("view engine", "pug");

app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
    //if(!req.file){res.send("No File Selected. Please Select a file to for upload and view the size.")}
    res.json({
    "name": req.file.originalname,
    "type": req.file.mimetype,
    "size": req.file.size
  })
});

// custom 500 page see https://expressjs.com/en/guide/error-handling.html
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  //you can also render custom html file
  res.send('500: Internal Server Error. Please ensure you selected a file for upload before submitting.');
});

// custom 404 page, see https://expressjs.com/en/starter/faq.html
app.use(function (req, res, next) {
  res.status(404);
  //console.error(err);
  //you can also render custom html file
  res.send('404: Page not found!');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
