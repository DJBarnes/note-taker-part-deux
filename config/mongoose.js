// Load the config and mongoose
var config = require('./config'),
    mongoose = require('mongoose');

// Register the db and the models in the app
module.exports = function () {
    // Create the connection to the mongo db
    var db = mongoose.connect(config.db);
    // Load any mongoose models that we want to use in this app
    // Load the Note Model
    require('../app/models/note.server.model');
    // Load the User Model
    require('../app/models/user.server.model');

    // Return the created db
    return db;
};