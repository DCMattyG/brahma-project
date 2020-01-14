// Required Modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var mongoose = require('mongoose');

var app = express();

// CORS Settings
var originsWhitelist = [
  '*'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}

// Mongoose Settings
var mongoSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

// Connect to MongoDB Database
mongoose.connect('mongodb://localhost:27017', mongoSettings);

// Express Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist/brahma-project')));
// app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
  next();
});

// Routes
app.use('/api', apiRouter);
app.use('/', indexRouter);

module.exports = app;
