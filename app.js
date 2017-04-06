'use strict';
// Required Libs
require('dotenv-safe').load({ allowEmptyValues: true });
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let http = require('http').Server(app);
let port = process.env.PORT;
let path = require('path');
let passport = require('passport');
let winston = require('winston');
let bodyParser = require('body-parser');


//Set app root
global.appRoot = path.resolve(__dirname);

// Parse body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add logging
let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ handleExceptions: true }),
    new (winston.transports.File)({ filename: `${appRoot}/runtime.log`, handleExceptions: true })
  ],
  level: 'silly',
  exitOnError: false
});

// DB connection
mongoose.connect(process.env.DBURL); // connect to our database
mongoose.connection.on('error', function (err) {
  // Do something
  logger.error('Database connection failed - ' + err);
});

// Serve static
app.use(express.static('public'));

// Require models
let models = require('./app_server/model')(mongoose);

// Init passport
app.use(passport.initialize());
require('./app_server/common/passport')(passport, models);

// Require Controllers
require('./app_server/controller')(app, passport, models, logger);

// Start
http.listen(port, 'localhost', function () {
  console.log('App started on ' + port);
});

module.exports = app;
