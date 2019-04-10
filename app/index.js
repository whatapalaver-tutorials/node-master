/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string
const server = http.createServer(function(req,res){
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

  // Send the response
  res.end('Hello World\n');

  // Log the path requested
  console.log(`Request received on path: ${trimmedPath} with method ${method} and with these query string params: `, queryStringObject)
  
})

// Start the server and have it listen on port 3000
server.listen(3000, function(){
  console.log('Listening on port 3000')
});
