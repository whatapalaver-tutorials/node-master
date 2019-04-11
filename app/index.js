/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function(req,res) {
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
      res.writeHead(statusCode)
      res.end(payloadString);

      // Log the path requested
      console.log(`Returning this response: ${statusCode} ${buffer}`)

    });
  });
})

// Start the server and have it listen on port 3000
server.listen(3000, function() {
  console.log('Listening on port 3000')
});

// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
  // Callback an HTTP status code and a payload object
  callback(406, {'name' : 'sample handler'});
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// Define a request router
let router = {
  'sample' : handlers.sample
}
