module.exports = function (app) {
    var note = require('../controllers/note.server.controller');
    app.get('/', note.index);
    app.get('/create', note.create);
    app.post('/store', note.store);
    app.get('/edit/:id', note.edit);
    app.post('/update/:id', note.update);
    app.post('/destroy/:id', note.destroy);
};