// These are the request handlers

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
let handlers = {};

// Users
handlers.users = function(data, callback) {
  let acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the users submethods
handlers._users = {};

// Users - POST
// Required data: firstname, lastname, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
  // Check that all required fields are present
  let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && password && tosAgreement) {
    // Make sure the user doesn't already exist
    _data.read('users', phone, function(err, data) {
      if(err) {
        // error represents that user doesn't already exist
        // Hash the password using built in library crypto
        let hashedPassword = helpers.hash(password);
        // Create the user object
        if(hashedPassword) {
          let userObject = {
            'firstName' : 'firstName',
            'lastName' : 'lastName',
            'phone' : 'phone',
            'hashedPassword' : 'hashedPassword',
            'tosAgreement' : true,
          };
  
          // Store the user
          _date.create('users', phone, userObject, function(err) {
            if(!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {'Error' : 'A user with that phone number already exists'});
            }
          });
        } else {
          callback(500, {'Error' : 'Could not hash the user password'})
        }
        

      } else {
        // User already exists
        callback(400, {'Error' : 'A user with that phone number already exists'});
      }
    })
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// Users - GET
handlers._users.get = function(data, callback) {

};

// Users - PUT
handlers._users.put = function(data, callback) {

};

// Users - DELETE
handlers._users.delete = function(data, callback) {

};

// Ping handler
handlers.ping = function(data, callback) {
  // Callback an HTTP status code and a payload object
  callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// Export the module
module.exports = handlers
