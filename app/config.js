// Create and export config variables

// Container for all the environments
const environments = {};

// Staging default object
environments.staging = {
  'port' : 3000,
  'envName' : 'staging'
};

// Production environment
environments.production = {
  'port' : 5000,
  'envName' : 'production'
}

// Determine which environment was passed as command line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is defined
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
