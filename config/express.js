// Load additional packages
var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');

// Create the express app
module.exports = function () {

    // Declare express app
    var app = express();

    // Set environment
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Config bodyParser to accept urlencoded properties and json
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // Setup methodOverride
    app.use(methodOverride());

    // Configure Session
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    // Configure default views directory and engine
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    // Load the app routes file
    // Other route files can be registered here if needed.
    require('../app/routes/note.server.routes.js')(app);

    // Configure default public directory
    app.use(express.static('./public'));

    // Return the configured app
    return app;
};