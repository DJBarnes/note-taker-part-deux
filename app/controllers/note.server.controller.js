// Create a var to hold the class for a Note model
var Note = require('mongoose').model('Note');

// GET request for the list of notes
exports.index = function (req, res) {

    // Get the viewData defaults and anything stored in the session
    var viewData = getViewDataObject(req);

    // Use the Note model to get all of the notes that match
    // the query params. Send in a empty object for the query
    // params so that all Notes are returned.
    // If an error occurs it will be in the err var of the callback.
    // The notes it retrives will be in the notes var of the callback.
    Note.find({}, function(err, notes) {
        // If there were errors
        if (err) {
            // Loop through each error in the err object
            for (propertyName in err.errors) {
                // Put the message for each error into the sessions errors object
                req.session.errors.push(err.errors[propertyName].message);
            }
            // Since there were errors, let's just set the notes for the viewData
            // object to an empty array.
            viewData.notes = [];
        // Else, everything worked and there were no errors.
        } else {
            // Put the notes that were retrived into the viewData
            viewData.notes = notes;
        }
        // Render out the index page with the viewData
        res.render('note/index', viewData);
    });
};

// GET request for showing the form to create a new note
exports.create = function (req, res) {

    // Get the viewData defaults and anything stored in the session
    var viewData = getViewDataObject(req);

    // The viewData may already contain a Note that was previously
    // submitted with errors. If so, we won't need a new one.
    // Othewise, if there is not a note already in the viewData, we
    // want to make a new one so that the view can still access the
    // properties of the viewData's note.

    // If there is no note in the viewData
    if (!viewData.note) {
        // Add a new Note to the viewData.
        viewData.note = new Note();
    }

    // Render out the create page with the viewData
    res.render('note/create', viewData);
}

// POST request to store the information from the create form
// as a new instance of Note in the database
exports.store = function (req, res) {

    // Create a new Note from the request body parameters
    var note = new Note(req.body);

    // Attempt to save the new Note.
    // It is possible that it will fail due to validation errors.
    // In that case, it will trigger the check for err.
    note.save(function (err) {
        // If there was an error (Most likely validation)
        if (err) {
            // Loop through each error in the err object
            for (propertyName in err.errors) {
                // Push each error's message into the session's errors object
                req.session.errors.push(err.errors[propertyName].message);
                // Set another property in the session that will tell the view
                // whether or not it should show the form field as invalid
                // from a validation failure.
                // The session property that we are going to set will be
                // the propertyName concated to the work Class.
                // EX: if there is an error with the subject, it will set
                // req.session.subjectClass to 'is-invalid'
                req.session[propertyName + 'Class'] = 'is-invalid';
            }
            // Set the session's note to the note that we were trying to save.
            // This way any properties that the user submitted can be passed back
            // to the create page when we return there with the errors.
            // This will prevent the user from having to re-enter what they have
            // already entered once
            req.session.note = note;
            // Redirect back to the create page. The errors and the Note model
            // that failed during save is in the session, and the create method
            // will fetch those errors and note model out when it calls
            // getViewDataObject()
            res.redirect('create');
        // Else, there were no issues, return to the index page with a success message
        } else {
            // Push a success message onto the sessions messages object
            req.session.messages.push("Note Created Successfully");
            // Redirect back to the index page
            res.redirect('/');
        }
    });
};

// GET request for showing the form to allow editing of a Note
exports.edit = function (req, res) {

    // Get the viewData defaults and anything stored in the session
    var viewData = getViewDataObject(req);

    // Define the search term to use.
    // The search term is the _id that was passed through the
    // route params as the database records id.
    var searchTerm = {
        _id: req.params.id
    }

    // Use the Note model to find one single note that
    // matches the searchTerm. Since our searchTerm is using the
    // db id, there should only ever be one result.
    Note.findOne(searchTerm, function(err, note) {
        // If the search threw an error
        if (err) {
            // For each error in the err object
            for (propertyName in err.errors) {
                // Put the error's message into the session
                req.session.errors.push(err.errors[propertyName].message);
            }
            // Redirect back to the index page. Errors will be retrived
            // from the session there where they can be displayed
            res.redirect('/');
        // Else, there were no problems. A Note was found and stored in
        // the note variable
        } else {
            // If the note is null, we need to redirect back with an error.
            // it is possible that the user is trying to edit one that does not
            // exist. They could only do this if they manually entered the URL
            // with an invalid id. A race condition could cause this too I suppose.
            if (!note) {
                // Add error to the session
                req.session.errors.push("A Note with that id does not exist");
                // Redirect back to the index page.
                res.redirect('/');
            } else {
                // Put the note into the viewData
                viewData.note = note;
                // Render out the edit view with the viewData
                res.render('note/edit', viewData);
            }
        }
    });
}

// POST method to update a Note with an id that matches the one passed
// by the route parameter id with the data submitted from the edit form.
exports.update = function (req, res) {

    // Use the Note model to find a note by it's id, and update it's properties
    // First argument is the id, which is fetched from the route params.
    // Second argument is the request body which contains the updated properties for the note.
    // Third argument is the option object where we are telling it
    // to re-validate from the model's Schema.
    // Last argument is the callback for catching the errors
    Note.findByIdAndUpdate(
        // Id
        req.params.id,
        // Properties to update
        req.body,
        // Options
        {
            runValidators: true
        },
        // Callback
        function(err) {
            // If there is an error with the validation or update
            if (err) {
                // For each error in the err object
                for (propertyName in err.errors) {
                    // Put the error's message into the session
                    req.session.errors.push(err.errors[propertyName].message);
                    // Add the class for css. Refer to the store method for how
                    // this works.
                    req.session[propertyName + 'Class'] = 'is-invalid';
                }
                // Since there was an error, we will make a new Note with the same
                // properties as what the user tried to submit, and then put it into
                // the session. This way when it redirects back to the edit page, any
                // data that was entered by the user will be retained without them
                // having to re-enter it.
                req.session.note = new Note(req.body);
                // Redirect back to the edit page
                res.redirect('/edit/' + req.params.id);
            // Else, there were no issues
            } else {
                // Put the success message into the session
                req.session.messages.push("Note Updated Successfully!");
                // Redirect back to the index page
                res.redirect('/');
            }
        }
    );
}

// POST request to delete a model from the database based on the id
// route parameter sent in the request.
exports.destroy = function (req, res) {
    
    // Use the Note model to delete one model that matches the passed in query.
    // In this case, the query is for the id that was passed in the route params
    Note.deleteOne({_id:req.params.id}, function(err) {
        // If there was an error
        if (err) {
            // For each error in the err object
            for (propertyName in err.errors) {
                // Put the error's message in the session
                req.session.errors.push(err.errors[propertyName].message);
            }
            // Redirect back to the edit page
            res.redirect('/edit/' + req.params.id);
        // Else, nothing went wrong. Redirect back to index with success
        } else {
            // Put a success message in the session
            req.session.messages.push("Note Deleted Successfully!");
            // Redirect back to the index page
            res.redirect('/');
        }
    });
}

// Returns viewData consisting of data in the session or
// some defaults that will prevent the view from crashing.
var getViewDataObject = function (req) {

    // Get the messages, errors, subjectClass, bodyClass, and note from
    // the session. If the value is null or undefined it will be set below.
    var messages = req.session.messages;
    var errors = req.session.errors;
    var subjectClass = req.session.subjectClass;
    var bodyClass = req.session.bodyClass;
    var note = req.session.note;

    // If any of the fetched values are null or undefined,
    // set it to a default value.
    messages = (messages) ? messages : [];
    errors = (errors) ? errors : [];
    subjectClass = (subjectClass) ? subjectClass : "";
    bodyClass = (bodyClass) ? bodyClass : "";
    note = (note) ? note : new Note();

    // Create the viewData object with the values either pulled
    // out of the session or assigned as a default.
    viewData = {
        messages: messages,
        errors: errors,
        subjectClass: subjectClass,
        bodyClass: bodyClass,
        note: note,
    };

    // Set all of the session values to defaults.
    // This way the values are only valid for the current
    // request that is accessing this viewData.
    // It will essentially prevent an error message from never going away.
    req.session.messages = [];
    req.session.errors = [];
    req.session.subjectClass = "";
    req.session.bodyClass = "";
    req.session.note = null;

    // Return the viewData object.
    return viewData;
};
