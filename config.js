/*
*
*
*  Create and Export configuration variables
*/
const environments = {};

// Staging configuration
environments.staging = {
  "httpPort": 3000,
  "httpsPort": 3001,
  "envName":"stagging"
};
// Production configuration
environments.production = {
  "httpPort": 5000,
  "httpsPort": 5001,
  "envName":"production"
};

//Determine which environment has been passed in the commmand line
let currentEnv = typeof(process.env.NODE_ENV) == "string"?process.env.NODE_ENV.toLowerCase() : "";
let environmentToExport = typeof(environments[currentEnv]) == "object" ? environments[currentEnv] :  environments.staging;

module.exports = environmentToExport;
