// Set up all of the routes for this app
module.exports = function (app) {
    // Create a controller that can be used in the route definitions
    var note = require('../controllers/note.server.controller');

    // List out all of the routes for the app
    // The convention used here is following REST principles
    // Each listed url will be handled by the second argument, which
    // is the method to call on the note controller defined above.
    app.get('/', note.index);
    app.get('/create', note.create);
    app.post('/store', note.store);
    app.get('/edit/:id', note.edit);
    app.post('/update/:id', note.update);
    app.post('/destroy/:id', note.destroy);
};