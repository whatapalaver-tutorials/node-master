/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');

// TESTING
// @TODO Delete this

// _data.update('test', 'newFile', {'fizz' : 'buzz'}, function(err, data) {
//   console.log('this was the error', err)
// })

// _data.read('test', 'newFile', function(err, data) {
//   console.log('this was the error', err, 'and this was the new data', data)
// })

// _data.delete('test', 'newFile', function(err) {
//   console.log('this was the error', err)
// })

// Instantiate the http server
const httpServer = http.createServer(function(req,res) {
  unifiedServer(req, res);
})

// Start the http server
httpServer.listen(config.httpPort, function() {
  console.log(`Listening on port ${config.httpPort} in ${config.envName} mode`)
});

// Instatiate the https server
const httpsServerOptions = {
  'key' :  fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, function(req,res) {
  unifiedServer(req, res);
})

// Start the https server
httpsServer.listen(config.httpsPort, function() {
  console.log(`Listening on port ${config.httpsPort} in ${config.envName} mode`)
});

// All the server logoc for both http and https server
const unifiedServer = function(req, res) {
  // Get the URL and parse it
  let parsedUrl = url.parse(req.url, true);
  
  // Get path from URL
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP method
  let method = req.method.toLowerCase();

  // Get the headers as an object
  let headers = req.headers;
  console.log("TCL: headers", headers)
  
  // Get the payload if it exists
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler the request should go to
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the specified handler

    chosenHandler(data, function(statusCode, payload) {
      // Use the status code called back by handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler or default to empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString);

      // Log the path requested
      console.log(`Returning this response: ${statusCode} ${buffer}`)

    });
  });
 };

// Define a request router
let router = {
  'ping' : handlers.ping,
  'users' : handlers.users
}
