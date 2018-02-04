// Configures and launches the server
// This is the main entry point for the entire server

// Load the development config
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Load the mongoose and express config
var mongoose = require('./config/mongoose'),
    express = require('./config/express');
// Create the mongo db database connection
var db = mongoose();
// Create the express app
var app = express();

// Set the app to listen on port 3000
app.listen(3000);

// Launch the server
module.exports = app;

// Log that the server is started
console.log('Server running at http://localhost:3000/');