'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var app = module.exports = loopback();
var env = require('get-env')({
  test: 'test'
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --


// boot scripts mount components like REST API
boot(app, __dirname);

var staticPath = null;

if (env !== 'prod') {
  staticPath = path.resolve(__dirname, '../client/app');
  console.log("Running app in development mode");
} else {
  staticPath = path.resolve(__dirname, '../dist/');
  console.log("Running app in prodction mode");
}

app.use(loopback.static(staticPath));

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
