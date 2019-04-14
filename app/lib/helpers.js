// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('./config')

// Containers for all the helpers

const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
  if(typeof(str) == 'string' && str.length > 0) {
    let hash = crypto.createHash('sha256', config.hashingSecret).update(str).digest('hex')
    return hash;
  } else {
    return false
  }
}

// Expost the module
module.exports = helpers
