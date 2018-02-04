var Note = require('mongoose').model('Note');

exports.index = function (req, res) {

    var viewData = getViewDataObject(req);

    viewData.notes = [];

    res.render('note/index', viewData);

};

exports.create = function (req, res) {

    var viewData = getViewDataObject(req);

    res.render('note/create', viewData);
}


exports.store = function (req, res) {

    var errors = validateRequest(req);

    if (errors) {
        // redirect back with errors
    }

    // var note = new Note(req.body);

    // note.save(function (err) {
    //     if (err) {
    //         return next(err);
    //     } else {
    //         res.json(user);
    //     }
    // });

    // Add flash message
    req.session.flash.push("Note Created Successfully!");

    // Redirect back to the root route.
    res.redirect('/');

};

exports.edit = function (req, res) {

    var viewData = getViewDataObject(req);

    res.render('note/edit', viewData);
}

exports.update = function (req, res) {
    var errors = validateRequest(req);

    if (errors) {
        // redirect back with errors
    }

    // Add flash message
    req.session.messages.push("Note Updated Successfully!");

    res.redirect('/');
}

exports.destroy = function (req, res) {
    req.session.messages.push("Note Deleted Successfully!");

    res.redirect('/');
}

// Returns the default viewData object that will be used when
// rendering out the view.
var getViewDataObject = function (req) {

    var messages = req.session.messages;
    var errors = req.session.errors;

    messages = (messages) ? messages : [];
    errors = (errors) ? errors : [];

    viewData = {
        messages: messages,
        errors: errors
    };

    req.session.messages = [];
    req.session.errors = [];

    return viewData;
};

// Method to validate the request and ensure that all fields were filled out.
// If any of the validatin fails, the method will return the errors.
var validateRequest = function (req) {
    return null;
};